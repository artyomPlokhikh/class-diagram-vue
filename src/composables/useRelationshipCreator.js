import { computed, inject, ref } from "vue";
import {
    calculateBorderRelativePosition,
    calculateConnectionPoint,
    calculateOrthogonalPosition,
    getCanvasCoordinates
} from "@/utils/mathHelpers.js";
import Relationship from "@/models/Relationship.js";

export function useRelationshipCreator(diagramStore, canvasRef, pan, zoom) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const pendingRelationship = ref(null);
    const startPoint = ref({ x: 0, y: 0 });

    const endPoint = ref({ x: 0, y: 0 });
    const currentHandleType = ref(null);
    const originalRelationship = ref(null);
    const isFollowingCursor = ref(false);

    const handleRelationshipConnect = (connectionInfo) => {
        if (!pendingRelationship.value) {
            pendingRelationship.value = new Relationship({
                src: {
                    id: connectionInfo.entityId,
                    border: connectionInfo.border,
                    position: connectionInfo.position
                }
            });
            startPoint.value = calculateConnectionPoint(
                diagramStore.entities.find(e => e.id === connectionInfo.entityId),
                pendingRelationship.value.src.border,
                pendingRelationship.value.src.position
            );
            endPoint.value = startPoint.value;
            startFollowingCursor();
        } else {
            if (shiftPressed.value) {
                const lastFixedPoint = pendingRelationship.value.bendPoints.length > 0
                    ? pendingRelationship.value.bendPoints.slice(-1)[0]
                    : startPoint.value;
                const orthogonalEnd = endPoint.value;
                const isHorizontal = orthogonalEnd.y === lastFixedPoint.y;
                const targetBorder = connectionInfo.border;
                const validHorizontal = isHorizontal && (targetBorder === 'left' || targetBorder === 'right');
                const validVertical = !isHorizontal && (targetBorder === 'top' || targetBorder === 'bottom');

                if (!validHorizontal && !validVertical) {
                    pendingRelationship.value.bendPoints.push(orthogonalEnd);
                    return;
                }

                const targetEntity = diagramStore.entities.find(e => e.id === connectionInfo.entityId);
                const entityRect = {
                    left: targetEntity.x,
                    top: targetEntity.y,
                    right: targetEntity.x + targetEntity.width,
                    bottom: targetEntity.y + targetEntity.height,
                    width: targetEntity.width,
                    height: targetEntity.height
                };

                connectionInfo.position = calculateBorderRelativePosition(
                    entityRect,
                    targetBorder,
                    { x: orthogonalEnd.x, y: orthogonalEnd.y }
                );
            }

            if (originalRelationship.value) {
                const handle = currentHandleType.value;
                originalRelationship.value.bendPoints = handle === 'src'
                    ? [...pendingRelationship.value.bendPoints, ...originalRelationship.value.bendPoints]
                    : [...originalRelationship.value.bendPoints, ...pendingRelationship.value.bendPoints];

                originalRelationship.value[handle] = {
                    id: connectionInfo.entityId,
                    border: connectionInfo.border,
                    position: connectionInfo.position,
                    mult: originalRelationship.value[handle].mult
                };

                diagramStore.updateRelationship(originalRelationship.value);
            } else {
                if (pendingRelationship.value.src.id !== connectionInfo.entityId) {
                    pendingRelationship.value.trg = {
                        id: connectionInfo.entityId,
                        border: connectionInfo.border,
                        position: connectionInfo.position
                    };
                    diagramStore.addRelationship(pendingRelationship.value);
                }
            }
            resetRelationship();
            stopFollowingCursor();
        }
    };

    const handleRelationshipDrag = (payload) => {
        const { relationship, handleType } = payload;

        originalRelationship.value = relationship;
        currentHandleType.value = handleType;

        pendingRelationship.value = new Relationship({
            ...relationship.toJSON(),
            bendPoints: []
        });

        if (relationship.bendPoints.length > 0) {
            startPoint.value = handleType === 'src'
                ? relationship.bendPoints[0]
                : relationship.bendPoints[relationship.bendPoints.length - 1];
        } else {
            const oppositeHandle = handleType === 'src' ? 'trg' : 'src';
            startPoint.value = calculateConnectionPoint(
                diagramStore.entities.find(e => e.id === relationship[oppositeHandle].id),
                relationship[oppositeHandle].border,
                relationship[oppositeHandle].position
            );
        }
        endPoint.value = startPoint.value;

        diagramStore.setSelected(relationship);
        startFollowingCursor();
    };

    const startFollowingCursor = () => {
        isFollowingCursor.value = true;
        window.addEventListener('mousemove', updateEndPoint);
        window.addEventListener('mousedown', handleCancel);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
    };

    const stopFollowingCursor = () => {
        isFollowingCursor.value = false;
        window.removeEventListener('mousemove', updateEndPoint);
        window.removeEventListener('mousedown', handleCancel);
        window.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('keydown', handleKeyDown);
    };

    const updateEndPoint = (event) => {
        if (!canvasRef.value) return;
        const rawPos = getCanvasCoordinates(event, canvasRef.value, pan.value, zoom.value);

        const lastFixedPoint = pendingRelationship.value?.bendPoints?.length > 0
            ? pendingRelationship.value.bendPoints.slice(-1)[0]
            : startPoint.value;

        endPoint.value = shiftPressed.value
            ? calculateOrthogonalPosition(rawPos, lastFixedPoint)
            : rawPos;
    };

    const handleCancel = (event) => {
        if (event.button === 0) {
            const clickedOnEntity = event.target.closest('.entity') !== null;
            const clickedOnConnectionPoint = event.target.closest('.connection-point') !== null;

            if (!clickedOnEntity && !clickedOnConnectionPoint && pendingRelationship.value) {
                const newPoint = shiftPressed.value
                    ? { ...endPoint.value }
                    : getCanvasCoordinates(event, canvasRef.value, pan.value, zoom.value);

                pendingRelationship.value.bendPoints.push(newPoint);
            }
        }
    };

    const handleContextMenu = (event) => {
        if (pendingRelationship.value) {
            event.preventDefault();

            if (pendingRelationship.value.bendPoints.length > 0) {
                pendingRelationship.value.bendPoints.pop();
            } else {
                resetRelationship();
                stopFollowingCursor();
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && pendingRelationship.value) {
            resetRelationship();
            stopFollowingCursor();
        }
    };

    const resetRelationship = () => {
        pendingRelationship.value = null;
        originalRelationship.value = null;
        currentHandleType.value = null;
        startPoint.value = { x: 0, y: 0 };
        endPoint.value = { x: 0, y: 0 };
    };

    const previewPath = computed(() => {
        if (!pendingRelationship.value) return '';

        const points = [
            startPoint.value,
            ...pendingRelationship.value.bendPoints,
            endPoint.value
        ];

        return points.map(p => `${p.x},${p.y}`).join(' ');
    });

    return {
        pendingRelationship,
        previewPath,
        startPoint,
        endPoint,
        handleRelationshipConnect,
        handleRelationshipDrag,
    }
}
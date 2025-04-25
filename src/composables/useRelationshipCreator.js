import { ref } from "vue";
import { calculateConnectionPoint, calculateDragConnectionPoints, getCanvasCoordinates } from "@/utils/mathHelpers.js";
import Relationship from "@/models/Relationship.js";

export function useRelationshipCreator(diagramStore, canvasRef, pan, zoom) {
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
            startFollowingCursor();
        } else {
            if (originalRelationship.value) {
                const handle = currentHandleType.value;
                originalRelationship.value[handle] = {
                    id: connectionInfo.entityId,
                    border: connectionInfo.border,
                    position: connectionInfo.position,
                    mult: originalRelationship.value[handle].mult
                };

                if (pendingRelationship.value.bendPoints.length > 0) {
                    originalRelationship.value.bendPoints =
                        handle === 'src'
                            ? pendingRelationship.value.bendPoints
                            : [...pendingRelationship.value.bendPoints];
                }

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

    const handleRelationshipDrag = (relationship, handleType) => {
        originalRelationship.value = relationship;
        currentHandleType.value = handleType;
        pendingRelationship.value = new Relationship(relationship.toJSON());

        const { fixedPoint, removeCount } = calculateDragConnectionPoints(
            relationship,
            diagramStore.entities,
            handleType
        );

        startPoint.value = fixedPoint;

        if (handleType === 'src') {
            pendingRelationship.value.bendPoints.splice(0, removeCount);
        } else {
            pendingRelationship.value.bendPoints.splice(-removeCount, removeCount);
        }

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
        endPoint.value = getCanvasCoordinates(
            event,
            canvasRef.value,
            pan.value,
            zoom.value
        );
    };

    const handleCancel = (event) => {
        if (event.button === 0) {
            const clickedOnEntity = event.target.closest('.entity') !== null;
            const clickedOnConnectionPoint = event.target.closest('.connection-point') !== null;

            if (!clickedOnEntity && !clickedOnConnectionPoint && pendingRelationship.value) {
                resetRelationship();
                stopFollowingCursor();
            }
        }
    };

    const handleContextMenu = (event) => {
        if (pendingRelationship.value) {
            event.preventDefault();
            resetRelationship();
            stopFollowingCursor();
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


    return {
        pendingRelationship,
        startPoint,
        endPoint,
        handleRelationshipConnect,
        handleRelationshipDrag,
    }
}
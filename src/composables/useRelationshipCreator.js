import { computed, inject, ref } from 'vue';
import {
    calculateConnectionPoint,
    calculateBorderRelativePosition,
    getCanvasCoordinates,
    calculateOrthogonalPosition
} from '@/utils/mathHelpers.js';
import Relationship from '@/models/Relationship.js';
import { useFollowCursor } from '@/composables/shared/useFollowCursor';

export function useRelationshipCreator(diagramStore, canvasRef, pan, zoomVal) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const pending = ref(null);
    const startPoint = ref({ x: 0, y: 0 });
    const endPoint = ref({ x: 0, y: 0 });
    const originalRelationship = ref(null);
    const currentHandleType = ref(null);


    const { start: followStart, stop: followStop } = useFollowCursor({
        onMove: (e) => {
            if (!pending.value || !canvasRef.value) return;
            const raw = getCanvasCoordinates(e, canvasRef.value, pan.value, zoomVal.value);
            const lastFixed = pending.value.bendPoints.length
                ? pending.value.bendPoints.slice(-1)[0]
                : startPoint.value;
            endPoint.value = shiftPressed.value
                ? calculateOrthogonalPosition(raw, lastFixed)
                : raw;
        },
        onMouseDown: (e) => {
            if (e.button !== 0 || !pending.value) return;
            const clickedOnEntity = e.target.closest('.entity') !== null;
            const clickedOnConnectionPoint = e.target.closest('.connection-point') !== null;
            if (!clickedOnEntity && !clickedOnConnectionPoint) {
                const newPoint = shiftPressed.value
                    ? { ...endPoint.value }
                    : getCanvasCoordinates(e, canvasRef.value, pan.value, zoomVal.value);
                pending.value.bendPoints.push(newPoint);
            }
        },
        onContextMenu: (e) => {
            if (!pending.value) return;
            e.preventDefault();
            if (pending.value.bendPoints.length > 0) {
                pending.value.bendPoints.pop();
            } else {
                pending.value = null;
                originalRelationship.value = null;
                currentHandleType.value = null;
                startPoint.value = { x: 0, y: 0 };
                endPoint.value = { x: 0, y: 0 };
                followStop();
            }
        },
        onEscape: () => {
            if (!pending.value) return;
            pending.value = null;
            originalRelationship.value = null;
            currentHandleType.value = null;
            startPoint.value = { x: 0, y: 0 };
            endPoint.value = { x: 0, y: 0 };
            followStop();
        }
    });


    const handleRelationshipConnect = (connectionInfo) => {
        if (!pending.value) {
            pending.value = new Relationship({
                src: {
                    id: connectionInfo.entityId,
                    border: connectionInfo.border,
                    position: connectionInfo.position
                }
            });
            const srcEnt = diagramStore.entities.find(e => e.id === connectionInfo.entityId);
            startPoint.value = calculateConnectionPoint(srcEnt, pending.value.src.border, pending.value.src.position);
            endPoint.value = { ...startPoint.value };
            followStart();
        } else {
            if (shiftPressed.value) {
                const lastFixed = pending.value.bendPoints.length > 0
                    ? pending.value.bendPoints.slice(-1)[0]
                    : startPoint.value;
                const orth = calculateOrthogonalPosition(endPoint.value, lastFixed);
                const ent = diagramStore.entities.find(e => e.id === connectionInfo.entityId);
                const rect = {
                    left: ent.x,
                    top: ent.y,
                    right: ent.x + ent.width,
                    bottom: ent.y + ent.height,
                    width: ent.width,
                    height: ent.height
                };
                connectionInfo.position = calculateBorderRelativePosition(rect, connectionInfo.border, orth);
            }
            if (originalRelationship.value) {
                const h = currentHandleType.value;
                originalRelationship.value.bendPoints = h === 'src'
                    ? [...pending.value.bendPoints, ...originalRelationship.value.bendPoints]
                    : [...originalRelationship.value.bendPoints, ...pending.value.bendPoints];
                originalRelationship.value[h] = {
                    id: connectionInfo.entityId,
                    border: connectionInfo.border,
                    position: connectionInfo.position,
                    mult: originalRelationship.value[h].mult
                };
                diagramStore.updateRelationship(originalRelationship.value);
            } else {
                if (pending.value.src.id !== connectionInfo.entityId) {
                    pending.value.trg = {
                        id: connectionInfo.entityId,
                        border: connectionInfo.border,
                        position: connectionInfo.position
                    };
                    diagramStore.addRelationship(pending.value);
                }
            }
            pending.value = null;
            originalRelationship.value = null;
            currentHandleType.value = null;
            followStop();
        }
    };


    const handleRelationshipDrag = ({ relationship, handleType }) => {
        originalRelationship.value = relationship;
        currentHandleType.value = handleType;
        pending.value = new Relationship({ ...relationship.toJSON(), bendPoints: [] });
        if (relationship.bendPoints.length > 0) {
            startPoint.value = handleType === 'src'
                ? relationship.bendPoints[0]
                : relationship.bendPoints[relationship.bendPoints.length - 1];
        } else {
            const opp = handleType === 'src' ? 'trg' : 'src';
            const ent = diagramStore.entities.find(e => e.id === relationship[opp].id);
            startPoint.value = calculateConnectionPoint(ent, relationship[opp].border, relationship[opp].position);
        }
        endPoint.value = { ...startPoint.value };
        diagramStore.setSelected(relationship);
        followStart();
    };


    const previewPath = computed(() => {
        if (!pending.value) return '';
        return [startPoint.value, ...pending.value.bendPoints, endPoint.value]
            .map(p => `${p.x},${p.y}`)
            .join(' ');
    });


    return {
        pendingRelationship: pending,
        previewPath,
        startPoint,
        endPoint,
        handleRelationshipConnect,
        handleRelationshipDrag
    };
}

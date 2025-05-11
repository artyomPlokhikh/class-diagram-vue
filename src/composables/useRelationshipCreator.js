/**
 * Relationship Creator
 *
 * This composable handles the interactive creation and modification of relationships
 * between diagram elements. It provides functionality for:
 *
 * - Starting new relationships from connection points
 * - Creating multi-segment paths with bend points
 * - Modifying existing relationships by dragging their endpoints
 * - Enforcing orthogonal connections when shift key is pressed
 * - Canceling in-progress relationships
 *
 * The relationship creator implements a state machine that tracks the relationship
 * drawing process from start to completion, providing visual feedback throughout.
 */
import { computed, inject, ref } from 'vue';
import {
    calculateConnectionPoint,
    calculateBorderRelativePosition,
    calculateOrthogonalPosition
} from '@/utils/mathHelpers.js';
import Relationship from '@/models/Relationship.js';
import { useFollowCursor } from '@/composables/shared/useFollowCursor';
import { useDiagramStore } from "@/stores/diagram.js";
import { useCameraStore } from "@/stores/camera.js";

export function useRelationshipCreator() {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const shiftPressed = inject('shiftPressed', ref(false));

    const pending = ref(null);
    const startPoint = ref({ x: 0, y: 0 });
    const endPoint = ref({ x: 0, y: 0 });
    const originalRelationship = ref(null);
    const currentHandleType = ref(null);


    const cancelPending = () => {
        pending.value = null;
        originalRelationship.value = null;
        currentHandleType.value = null;
        startPoint.value = { x: 0, y: 0 };
        endPoint.value = { x: 0, y: 0 };
        followStop();
    };
    
    /**
     * Sets up cursor tracking for interactive relationship creation
     * Handles various mouse events during the relationship drawing process
     */
    const { start: followStart, stop: followStop } = useFollowCursor({
        onMove: (e) => {
            if (!pending.value) return;
            const raw = cameraStore.getContainerCoordinates(e);
            const lastFixed = pending.value.bendPoints.length
                ? pending.value.bendPoints.slice(-1)[0]
                : startPoint.value;
            endPoint.value = shiftPressed.value
                ? calculateOrthogonalPosition(raw, lastFixed)
                : raw;
        },
        onMouseDown: (e) => {
            if (e.button !== 0 || !pending.value) return;
            const newPoint = shiftPressed.value
                ? { ...endPoint.value }
                : cameraStore.getContainerCoordinates(e);
            pending.value.bendPoints.push(newPoint);
        },
        onContextMenu: (e) => {
            if (!pending.value) return;
            e.preventDefault();
            if (pending.value.bendPoints.length > 0) {
                pending.value.bendPoints.pop();
            } else {
                cancelPending();
            }
        },
        onEscape: cancelPending
    });

    /**
     * Handles connection to an entity or other diagram element
     * This is a core function with dual behavior:
     * 1. When called first: Starts a new relationship from the connection point
     * 2. When called again: Completes the relationship to the target element
     *
     * @param {Object} connectionInfo - Information about where to connect
     */
    const handleRelationshipConnect = (connectionInfo) => {
        const diagramElement = diagramStore.findDiagramElement(connectionInfo.id, connectionInfo.type);
        if (!diagramElement) return;

        if (!pending.value) {
            // Starting a new relationship
            pending.value = new Relationship({
                src: {
                    id: connectionInfo.id,
                    type: connectionInfo.type,
                    border: connectionInfo.border,
                    position: connectionInfo.position,
                }
            });
            startPoint.value = calculateConnectionPoint(diagramElement, pending.value.src.border, pending.value.src.position);
            endPoint.value = { ...startPoint.value };
            followStart();
        } else {
            // Completing a relationship
            if (shiftPressed.value) {
                // Ensure final segment is orthogonal when shift is pressed
                const lastFixed = pending.value.bendPoints.length > 0
                    ? pending.value.bendPoints.slice(-1)[0]
                    : startPoint.value;
                const orth = calculateOrthogonalPosition(endPoint.value, lastFixed);
                const rect = {
                    left: diagramElement.x,
                    top: diagramElement.y,
                    right: diagramElement.x + diagramElement.width,
                    bottom: diagramElement.y + diagramElement.height,
                    width: diagramElement.width,
                    height: diagramElement.height
                };
                connectionInfo.position = calculateBorderRelativePosition(rect, connectionInfo.border, orth);
            }
            if (originalRelationship.value) {
                // Updating an existing relationship
                const h = currentHandleType.value;
                originalRelationship.value.bendPoints = h === 'src'
                    ? [...pending.value.bendPoints, ...originalRelationship.value.bendPoints]
                    : [...originalRelationship.value.bendPoints, ...pending.value.bendPoints];
                originalRelationship.value[h] = {
                    id: connectionInfo.id,
                    type: connectionInfo.type,
                    border: connectionInfo.border,
                    position: connectionInfo.position,
                    mult: originalRelationship.value[h].mult
                };
                diagramStore.updateRelationship(originalRelationship.value);
            } else {
                // Adding a new relationship
                if (pending.value.src.id !== connectionInfo.id) {
                    pending.value.trg = {
                        id: connectionInfo.id,
                        type: connectionInfo.type,
                        border: connectionInfo.border,
                        position: connectionInfo.position,
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


    /**
     * Handles dragging an existing relationship endpoint to modify it
     * Sets up state for modifying either the source or target connection point
     *
     * @param {Object} options - Contains the relationship to modify and which end to change
     */
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
            const diagramElement = diagramStore.findDiagramElement(relationship[opp].id, relationship[opp].type);
            startPoint.value = calculateConnectionPoint(diagramElement, relationship[opp].border, relationship[opp].position);
        }
        endPoint.value = { ...startPoint.value };
        diagramStore.setSelected(relationship);
        followStart();``
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

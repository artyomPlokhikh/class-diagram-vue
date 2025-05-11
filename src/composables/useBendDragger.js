/**
 * Relationship Bend Point Dragger
 *
 * This composable provides the functionality for interactively dragging bend points
 * in relationship lines. It handles the user interaction for modifying the path of
 * relationships between entities by manipulating their intermediate points.
 *
 * Features:
 * - Interactive dragging of bend points with live preview
 * - Snapping to grid or other elements
 * - Orthogonal constraint when shift key is pressed
 * - Escape key to cancel and restore original position
 * - Coordinate transformation between screen and diagram spaces
 */
import { inject, ref } from 'vue';
import { useFollowCursor } from '@/composables/shared/useFollowCursor';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';
import { useDiagramStore } from "@/stores/diagram.js";
import { useCameraStore } from "@/stores/camera.js";

export function useBendDragger() {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const shiftPressed = inject('shiftPressed', ref(false));
    const snapping = inject('snapping');

    const currentBend = ref(null);
    const initialBend = ref(null);

    /**
     * Set up cursor tracking for the bend point dragging operation
     * Uses the shared useFollowCursor composable
     */
    const { start: followStart, stop: followStop } = useFollowCursor({
        /**
         * Handle mouse movement during bend point dragging
         * Updates the bend point position and applies constraints
         *
         * @param {MouseEvent} e - Mouse move event
         */
        onMove: (e) => {
            const cb = currentBend.value;
            if (!cb || !cameraStore.container) return;
            const raw = cameraStore.getContainerCoordinates(e);

            let proposed = raw;
            let axis = 'both';
            if (shiftPressed.value) {
                proposed = calculateOrthogonalPosition(raw, initialBend.value);
                axis = proposed.x === initialBend.value.x ? 'y' : 'x';
            }
            cb.relationship.bendPoints[cb.bendIndex] = snapping.snapPoint(
                proposed,
                cb.relationship.id,
                axis
            );
        },

        /**
         * Finalize the drag operation when mouse is released
         * Updates the relationship in the diagram store
         */
        onMouseUp: () => {
            diagramStore.updateRelationship(currentBend.value.relationship);
            currentBend.value = null;
            initialBend.value = null;
            snapping.stop();
            followStop();
        },

        /**
         * Cancel the drag operation when Escape key is pressed
         * Restores the bend point to its original position
         */
        onEscape: () => {
            const cb = currentBend.value;
            if (cb) cb.relationship.bendPoints[cb.bendIndex] = initialBend.value;
            currentBend.value = null;
            initialBend.value = null;
            snapping.stop();
            followStop();
        }
    });

    /**
     * Start dragging a specific bend point in a relationship
     *
     * @param {Relationship} relationship - The relationship containing the bend point
     * @param {number} bendIndex - Index of the bend point in the relationship's bendPoints array
     */
    const startBendDrag = (relationship, bendIndex) => {
        diagramStore.setSelected(relationship);
        currentBend.value = { relationship, bendIndex };
        initialBend.value = relationship.bendPoints[bendIndex];

        const rect = cameraStore.container.getBoundingClientRect();
        snapping.start({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

        followStart();
    };


    return { startBendDrag };
}

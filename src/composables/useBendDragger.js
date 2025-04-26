import { inject, ref } from 'vue';
import { useFollowCursor } from '@/composables/shared/useFollowCursor';
import { calculateOrthogonalPosition, getCanvasCoordinates } from '@/utils/mathHelpers.js';

export function useBendDragger(diagramStore, canvasRef, pan, zoomVal) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const snapping = inject('snapping');
    const currentBend = ref(null);
    const initialBend = ref(null);


    const handleMouseUp = () => {
        currentBend.value = null;
        initialBend.value = null;
        snapping.stop();
        followStop();
    };


    const { start: followStart, stop: followStop } = useFollowCursor({
        onMove: (e) => {
            const cb = currentBend.value;
            if (!cb || !canvasRef.value) return;
            const raw = getCanvasCoordinates(e, canvasRef.value, pan.value, zoomVal.value);

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

            diagramStore.updateRelationship(cb.relationship);
        },
        onMouseUp: handleMouseUp,
        onEscape: () => {
            const cb = currentBend.value;
            if (cb) cb.relationship.bendPoints[cb.bendIndex] = initialBend.value;
            currentBend.value = null;
            initialBend.value = null;
            snapping.stop();
            followStop();
        }
    });


    const startBendDrag = (relationship, bendIndex) => {
        diagramStore.setSelected(relationship);
        currentBend.value = { relationship, bendIndex };
        initialBend.value = relationship.bendPoints[bendIndex];

        const rect = canvasRef.value.getBoundingClientRect();
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

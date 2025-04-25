import { inject, ref } from 'vue';
import { useFollowCursor } from '@/composables/shared/useFollowCursor';
import { getCanvasCoordinates, calculateOrthogonalPosition } from '@/utils/mathHelpers.js';

export function useBendDragger(diagramStore, canvasRef, pan, zoomVal) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const currentBend = ref(null);
    const initialBend = ref(null);

    const handleMouseUp = () => {
        currentBend.value = null;
        initialBend.value = null;
        followStop();
    };

    const { start: followStart, stop: followStop } = useFollowCursor({
        onMove: (e) => {
            const cb = currentBend.value;
            if (!cb || !canvasRef.value) return;
            const raw = getCanvasCoordinates(e, canvasRef.value, pan.value, zoomVal.value);
            cb.relationship.bendPoints[cb.bendIndex] = shiftPressed.value
                ? calculateOrthogonalPosition(raw, initialBend.value)
                : raw;
            diagramStore.updateRelationship(cb.relationship);
        },
        onMouseUp: handleMouseUp,
        onEscape: () => {
            const cb = currentBend.value;
            if (cb) {
                cb.relationship.bendPoints[cb.bendIndex] = initialBend.value;
            }
            currentBend.value = null;
            initialBend.value = null;
            followStop();
        }
    });

    const startBendDrag = (relationship, bendIndex) => {
        diagramStore.setSelected(relationship);
        currentBend.value = { relationship, bendIndex };
        initialBend.value = relationship.bendPoints[bendIndex];
        followStart();
    };

    return { startBendDrag };
}

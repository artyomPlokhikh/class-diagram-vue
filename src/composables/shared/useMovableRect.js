import { inject, ref } from 'vue';
import { useDrag } from '@/composables/shared/useDrag.js';
import { useDiagramStore } from '@/stores/diagram.js';
import { useCameraStore } from '@/stores/camera.js';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';

export function useMovableRect(model) {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const shiftPressed = inject('shiftPressed', ref(false));
    const snapping = inject('snapping');

    let startPos = { x: model.x, y: model.y };

    const { isDragging, start: startDragging } = useDrag({
        onStart(e) {
            startPos = { x: model.x, y: model.y };
            snapping.start({
                left: model.x,
                top: model.y,
                width: model.width,
                height: model.height
            });
        },
        onMove(e, state) {
            const dx = (e.clientX - state.clientX) / cameraStore.zoom;
            const dy = (e.clientY - state.clientY) / cameraStore.zoom;

            let raw = { x: startPos.x + dx, y: startPos.y + dy };
            let axis = 'both';

            if (shiftPressed.value) {
                raw = calculateOrthogonalPosition(raw, startPos);
                axis = raw.x === startPos.x ? 'y' : 'x';
            }

            const snapped = snapping.snapPoint(raw, model.id, axis);

            if (snapped.x !== raw.x) startPos.x = snapped.x - dx;
            if (snapped.y !== raw.y) startPos.y = snapped.y - dy;

            model.x = snapped.x;
            model.y = snapped.y;
        },
        onEnd() {
            snapping.stop();
            diagramStore.save();
        },
        onCancel() {
            model.x = startPos.x;
            model.y = startPos.y;
            snapping.stop();
        }
    });

    return { isDragging, startDragging };
}

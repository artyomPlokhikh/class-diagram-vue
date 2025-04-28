import { ref, inject } from 'vue';
import { useDrag } from '@/composables/shared/useDrag.js';
import { useResizeObserver } from '@/composables/shared/useResizeObserver.js';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';
import { useDiagramStore } from '@/stores/diagram.js';
import { useCameraStore } from '@/stores/camera.js';

export function useMovableResizable(model, elRef, { measureIntrinsic = true } = {}) {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const shiftPressed = inject('shiftPressed', ref(false));
    const snapping = inject('snapping');

    let startPos = { x: model.x, y: model.y };
    const { isDragging, start: startDragging } = useDrag({
        onStart: e => {
            startPos = { x: model.x, y: model.y };
            snapping.start({ left: model.x, top: model.y, width: model.width, height: model.height });
        },
        onMove: (e, state) => {
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
        onEnd: () => {
            snapping.stop();
            diagramStore.save();
        },
        onCancel: () => {
            model.x = startPos.x;
            model.y = startPos.y;
            snapping.stop();
        }
    });

    const isResized = ref(false);
    let resizeStart = { x: 0, y: 0 };
    let initSize = { width: model.width, height: model.height };
    let minSize = { width: 0, height: 0 };

    const { isDragging: isResizing, start: startResizing } = useDrag({
        onStart: e => {
            isResized.value = true;
            resizeStart = { x: e.clientX, y: e.clientY };
            initSize = { width: model.width, height: model.height };
            if (elRef.value && measureIntrinsic) {
                minSize = measureIntrinsicSize(elRef.value);
            }
            snapping.start({ left: model.x, top: model.y, width: model.width, height: model.height });
        },
        onMove: e => {
            const dx = (e.clientX - resizeStart.x) / cameraStore.zoom;
            const dy = (e.clientY - resizeStart.y) / cameraStore.zoom;
            let newW = Math.max(initSize.width + dx, minSize.width);
            let newH = Math.max(initSize.height + dy, minSize.height);

            const rawBR = { x: model.x + newW, y: model.y + newH };
            const snappedBR = snapping.snapPoint(rawBR, model.id, 'both');
            model.width = snappedBR.x - model.x;
            model.height = snappedBR.y - model.y;
        },
        onEnd: () => {
            snapping.stop();
            diagramStore.save();
        },
        onCancel: () => {
            model.width = initSize.width;
            model.height = initSize.height;
            isResized.value = false;
            if (elRef.value && measureIntrinsic) {
                const nat = measureIntrinsicSize(elRef.value);
                model.width = Math.max(model.width, nat.width);
                model.height = Math.max(model.height, nat.height);
            }
            snapping.stop();
        }
    });

    function resetSize() {
        if (!elRef.value || !measureIntrinsic) return;
        const nat = measureIntrinsicSize(elRef.value);
        model.width = nat.width;
        model.height = nat.height;
        isResized.value = false;
    }

    if (measureIntrinsic) {
        useResizeObserver(elRef, ([entry]) => {
            if (!isResizing.value && !isResized.value) {
                const nat = measureIntrinsicSize(entry.target);
                requestAnimationFrame(() => {
                    model.width = Math.max(model.width, nat.width);
                    model.height = Math.max(model.height, nat.height);
                });
            }
        });
    }

    return {
        isDragging,
        startDragging,
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized: isResized
    };
}

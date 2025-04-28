import { inject, ref } from 'vue';
import { useDrag } from '@/composables/shared/useDrag.js';
import { useDiagramStore } from '@/stores/diagram.js';
import { useCameraStore } from '@/stores/camera.js';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { useResizeObserver } from "@/composables/shared/useResizeObserver.js";

export function useResizableRect(model, elRef) {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();
    const snapping = inject('snapping');

    const isResized = ref(false);
    let resizeStart = { x: 0, y: 0 };
    let initSize = { width: model.width, height: model.height };
    let minSize = { width: 0, height: 0 };

    const { isDragging: isResizing, start: startResizing } = useDrag({
        onStart(e) {
            isResized.value = true;
            resizeStart = { x: e.clientX, y: e.clientY };
            initSize = { width: model.width, height: model.height };

            minSize = measureIntrinsicSize(elRef.value);

            snapping.start({
                left: model.x,
                top: model.y,
                width: model.width,
                height: model.height
            });
        },
        onMove(e) {
            const dx = (e.clientX - resizeStart.x) / cameraStore.zoom;
            const dy = (e.clientY - resizeStart.y) / cameraStore.zoom;

            let newW = Math.max(initSize.width + dx, minSize.width);
            let newH = Math.max(initSize.height + dy, minSize.height);

            const rawBR = { x: model.x + newW, y: model.y + newH };
            const snappedBR = snapping.snapPoint(rawBR, model.id, 'both');

            model.width = snappedBR.x - model.x;
            model.height = snappedBR.y - model.y;
        },
        onEnd() {
            snapping.stop();
            diagramStore.save();
        },
        onCancel() {
            model.width = initSize.width;
            model.height = initSize.height;
            isResized.value = false;

            const nat = measureIntrinsicSize(elRef.value);
            model.width = Math.max(model.width, nat.width);
            model.height = Math.max(model.height, nat.height);

            snapping.stop();
        }
    });

    function resetSize() {
        const nat = measureIntrinsicSize(elRef.value);
        model.width = nat.width;
        model.height = nat.height;
        isResized.value = false;
    }

    useResizeObserver(elRef, ([entry]) => {
        if (!isResizing.value && !isResized.value) {
            const nat = measureIntrinsicSize(entry.target);
            requestAnimationFrame(() => {
                model.width = Math.max(model.width, nat.width);
                model.height = Math.max(model.height, nat.height);
            });
        }
    });

    return {
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized: isResized
    };
}

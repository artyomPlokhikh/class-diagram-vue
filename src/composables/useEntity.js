import { inject, ref } from 'vue';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';
import { useDrag } from '@/composables/shared/useDrag';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { useResizeObserver } from '@/composables/shared/useResizeObserver';
import { useDiagramStore } from "@/stores/diagram.js";
import { useCameraStore } from "@/stores/camera.js";

export function useEntity(entity, elRef) {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const shiftPressed = inject('shiftPressed', ref(false));
    const snapping = inject('snapping');

    const isResized = ref(false);


    let initial = { x: entity.x, y: entity.y };
    const { isDragging, start: startDragging } = useDrag({
        onStart: () => {
            initial = { x: entity.x, y: entity.y };
            snapping.start({
                left: entity.x,
                top: entity.y,
                width: entity.width,
                height: entity.height,
            });
        },
        onMove: (e, s) => {
            const dx = (e.clientX - s.clientX) / cameraStore.zoom;
            const dy = (e.clientY - s.clientY) / cameraStore.zoom;
            let raw = { x: initial.x + dx, y: initial.y + dy };
            let axis = 'both';

            if (shiftPressed.value) {
                raw = calculateOrthogonalPosition(raw, initial);
                axis = raw.x === initial.x ? 'y' : 'x';
            }

            const snapped = snapping.snapPoint(raw, entity.id, axis);

            if (snapped.x !== raw.x) initial.x = snapped.x - dx;
            if (snapped.y !== raw.y) initial.y = snapped.y - dy;

            entity.x = snapped.x;
            entity.y = snapped.y;
        },
        onEnd: () => {
            snapping.stop();
            diagramStore.save();
        },
        onCancel: () => {
            entity.x = initial.x;
            entity.y = initial.y;
            snapping.stop();
        },
    });


    let sz0 = { x: 0, y: 0 };
    let initSz = { width: entity.width, height: entity.height };
    let frozen = { width: 0, height: 0 };
    const { isDragging: isResizing, start: startResizing } = useDrag({
        onStart: e => {
            isResized.value = true;
            sz0 = { x: e.clientX, y: e.clientY };
            initSz = { width: entity.width, height: entity.height };
            if (elRef.value) frozen = measureIntrinsicSize(elRef.value);
            snapping.start({
                left: entity.x,
                top: entity.y,
                width: entity.width,
                height: entity.height
            });
        },
        onMove: e => {
            const dx = (e.clientX - sz0.x) / cameraStore.zoom;
            const dy = (e.clientY - sz0.y) / cameraStore.zoom;

            let newW = Math.max(initSz.width + dx, frozen.width);
            let newH = Math.max(initSz.height + dy, frozen.height);

            const rawBR = { x: entity.x + newW, y: entity.y + newH };
            const snappedBR = snapping.snapPoint(rawBR, entity.id, 'both');
            newW = snappedBR.x - entity.x;
            newH = snappedBR.y - entity.y;

            entity.width = newW;
            entity.height = newH;
        },
        onEnd: () => {
            snapping.stop();
            diagramStore.save();
        },
        onCancel: () => {
            entity.width = initSz.width;
            entity.height = initSz.height;
            isResized.value = false;
            if (elRef.value) {
                const nat = measureIntrinsicSize(elRef.value);
                entity.width = Math.max(entity.width, nat.width);
                entity.height = Math.max(entity.height, nat.height);
            }
            snapping.stop();
        }
    });


    const resetSize = () => {
        if (!elRef.value) return;
        const nat = measureIntrinsicSize(elRef.value);
        entity.width = nat.width;
        entity.height = nat.height;
        frozen = nat;
        isResized.value = false;
    };


    useResizeObserver(elRef, ([entry]) => {
        if (!isResizing.value && !isResized.value) {
            const nat = measureIntrinsicSize(entry.target);
            requestAnimationFrame(() => {
                entity.width = Math.max(entity.width, nat.width);
                entity.height = Math.max(entity.height, nat.height);
            });
        }
    });


    return {
        isDragging,
        startDragging,
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized: isResized
    };
}

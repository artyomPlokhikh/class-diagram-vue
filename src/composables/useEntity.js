import { inject, ref } from 'vue';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';
import { useDrag } from '@/composables/shared/useDrag';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { useResizeObserver } from '@/composables/shared/useResizeObserver';

export function useEntity(entity, elRef) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const zoom = inject('zoom', ref(1));
    const snapping = inject('snapping');
    const isResized = ref(false);

    let initial = { x: entity.x, y: entity.y };
    const { isDragging, start: startDragging } = useDrag({
        onStart: () => {
            initial = { x: entity.x, y: entity.y };
            snapping.start({
                left: entity.x,
                right: entity.x + entity.width,
                top: entity.y,
                bottom: entity.y + entity.height
            });
        },
        onMove: (e, s) => {
            const dx = (e.clientX - s.clientX) / zoom.value;
            const dy = (e.clientY - s.clientY) / zoom.value;
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
        }
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
        },
        onMove: e => {
            const dx = (e.clientX - sz0.x) / zoom.value;
            const dy = (e.clientY - sz0.y) / zoom.value;
            entity.width = Math.max(initSz.width + dx, frozen.width);
            entity.height = Math.max(initSz.height + dy, frozen.height);
        },
        onEnd: null
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

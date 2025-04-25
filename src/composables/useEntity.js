import { inject, ref } from 'vue';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { calculateOrthogonalPosition } from '@/utils/mathHelpers.js';
import { useDrag } from '@/composables/shared/useDrag';
import { useResizeObserver } from '@/composables/shared/useResizeObserver';

export function useEntity(entity, elementRef) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const zoom = inject('zoom', ref(1));
    const isManuallyResized = ref(false);

    let initialPos = { x: entity.x, y: entity.y };
    const { isDragging, start: startDragging } = useDrag({
        onStart: (e) => {
            initialPos = { x: entity.x, y: entity.y };
        },
        onMove: (e, startEvent) => {
            let dx = (e.clientX - startEvent.clientX) / zoom.value;
            let dy = (e.clientY - startEvent.clientY) / zoom.value;
            if (shiftPressed.value) {
                const orth = calculateOrthogonalPosition({ x: dx, y: dy }, initialPos);
                dx = orth.x;
                dy = orth.y;
            }
            entity.x = initialPos.x + dx;
            entity.y = initialPos.y + dy;
        },
        onEnd: null
    });

    let sizeStart = { x: 0, y: 0 };
    let initialSize = { width: entity.width, height: entity.height };
    let frozenIntrinsicSize = { width: 0, height: 0 };
    const { isDragging: isResizing, start: startResizing } = useDrag({
        onStart: (e) => {
            isManuallyResized.value = true;
            sizeStart = { x: e.clientX, y: e.clientY };
            initialSize = { width: entity.width, height: entity.height };
            if (elementRef.value) {
                frozenIntrinsicSize = measureIntrinsicSize(elementRef.value);
            }
        },
        onMove: (e) => {
            const dx = (e.clientX - sizeStart.x) / zoom.value;
            const dy = (e.clientY - sizeStart.y) / zoom.value;
            entity.width = Math.max(initialSize.width + dx, frozenIntrinsicSize.width);
            entity.height = Math.max(initialSize.height + dy, frozenIntrinsicSize.height);
        },
        onEnd: null
    });

    const resetSize = () => {
        if (elementRef.value) {
            const nat = measureIntrinsicSize(elementRef.value);
            entity.width = nat.width;
            entity.height = nat.height;
            frozenIntrinsicSize = nat;
            isManuallyResized.value = false;
        }
    };

    useResizeObserver(elementRef, (entries) => {
        if (!isResizing.value && !isManuallyResized.value) {
            const nat = measureIntrinsicSize(entries[0].target);
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
        isManuallyResized
    };
}

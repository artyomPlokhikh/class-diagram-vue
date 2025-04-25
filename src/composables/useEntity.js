import { ref, inject, onMounted, onUnmounted } from 'vue';
import { measureIntrinsicSize } from '@/utils/domHelpers.js';
import { calculateOrthogonalPosition } from "@/utils/mathHelpers.js";

export function useEntity(entity, elementRef) {
    const shiftPressed = inject('shiftPressed', ref(false));
    const zoom = inject('zoom', { value: 1 });
    const isDragging = ref(false);
    const startPos = ref({ x: 0, y: 0 });
    const initialPos = ref({ x: entity.x, y: entity.y });
    let rafId = null;

    const onMouseMoveDragging = (event) => {
        if (!isDragging.value) return;

        let rawDirection = {
            x: (event.clientX - startPos.value.x) / zoom.value,
            y: (event.clientY - startPos.value.y) / zoom.value,
        }

        if (shiftPressed.value) {
            rawDirection = calculateOrthogonalPosition(rawDirection, initialPos.value);
        }

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            entity.x = initialPos.value.x + rawDirection.x;
            entity.y = initialPos.value.y + rawDirection.y;
        });
    };

    const onMouseUpDragging = () => {
        if (isDragging.value) {
            isDragging.value = false;
            document.removeEventListener('mousemove', onMouseMoveDragging);
            document.removeEventListener('mouseup', onMouseUpDragging);
            cancelAnimationFrame(rafId);
        }
    };

    const startDragging = (event) => {
        isDragging.value = true;
        startPos.value = { x: event.clientX, y: event.clientY };
        initialPos.value = { x: entity.x, y: entity.y };
        document.addEventListener('mousemove', onMouseMoveDragging);
        document.addEventListener('mouseup', onMouseUpDragging);
    };

    const isResizing = ref(false);
    const isManuallyResized = ref(false);
    const initialSize = ref({ width: 0, height: 0 });
    const frozenIntrinsicSize = ref({ width: 0, height: 0 });

    const onMouseMoveResizing = (event) => {
        if (!isResizing.value) return;
        const dx = (event.clientX - startPos.value.x) / zoom.value;
        const dy = (event.clientY - startPos.value.y) / zoom.value;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const newWidth = Math.max(initialSize.value.width + dx, frozenIntrinsicSize.value.width);
            const newHeight = Math.max(initialSize.value.height + dy, frozenIntrinsicSize.value.height);
            entity.width = newWidth;
            entity.height = newHeight;
        });
    };

    const onMouseUpResizing = () => {
        if (isResizing.value) {
            isResizing.value = false;
            document.removeEventListener('mousemove', onMouseMoveResizing);
            document.removeEventListener('mouseup', onMouseUpResizing);
            cancelAnimationFrame(rafId);
        }
    };

    const startResizing = (event) => {
        isResizing.value = true;
        isManuallyResized.value = true;
        startPos.value = { x: event.clientX, y: event.clientY };
        initialSize.value = { width: entity.width, height: entity.height };
        if (elementRef?.value) {
            frozenIntrinsicSize.value = measureIntrinsicSize(elementRef.value);
        }
        document.addEventListener('mousemove', onMouseMoveResizing);
        document.addEventListener('mouseup', onMouseUpResizing);
    };

    const resetSize = () => {
        if (elementRef?.value) {
            const naturalSize = measureIntrinsicSize(elementRef.value);
            entity.width = naturalSize.width;
            entity.height = naturalSize.height;
            frozenIntrinsicSize.value = naturalSize;
            isManuallyResized.value = false;
        }
    };

    let observer;
    onMounted(() => {
        if (elementRef?.value) {
            observer = new ResizeObserver((entries) => {
                if (!isResizing.value && !isManuallyResized.value) {
                    const naturalSize = measureIntrinsicSize(entries[0].target);
                    requestAnimationFrame(() => {
                        entity.width = Math.max(entity.width, naturalSize.width);
                        entity.height = Math.max(entity.height, naturalSize.height);
                    });
                }
            });
            observer.observe(elementRef.value);
        }
    });

    onUnmounted(() => {
        observer?.disconnect();
        cancelAnimationFrame(rafId);
    });

    return {
        isDragging, startDragging, isResizing, startResizing, resetSize, isManuallyResized,
    };
}
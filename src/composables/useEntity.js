import { ref, inject, onMounted, onUnmounted } from 'vue'
import { measureIntrinsicSize } from '@/utils/domHelpers.js'

export function useEntity(entity, elementRef) {

    const zoom = inject('zoom', { value: 1 });
    const isDragging = ref(false);
    const startPos = ref({ x: 0, y: 0 });
    const initialPos = ref({ x: entity.x, y: entity.y });

    const onMouseMoveDragging = (event) => {
        if (isDragging.value) {
            const dx = event.clientX - startPos.value.x;
            const dy = event.clientY - startPos.value.y;
            entity.x = initialPos.value.x + dx / zoom.value;
            entity.y = initialPos.value.y + dy / zoom.value;
        }
    };

    const onMouseUpDragging = () => {
        if (isDragging.value) {
            isDragging.value = false;
            document.removeEventListener('mousemove', onMouseMoveDragging);
            document.removeEventListener('mouseup', onMouseUpDragging);
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
    const initialSize = ref({ width: entity.width, height: entity.height });
    const frozenIntrinsicSize = ref({ width: 0, height: 0 });

    const onMouseMoveResizing = (event) => {
        if (isResizing.value) {
            const dx = event.clientX - startPos.value.x;
            const dy = event.clientY - startPos.value.y;
            let newWidth = initialSize.value.width + dx / zoom.value;
            let newHeight = initialSize.value.height + dy / zoom.value;

            newWidth = Math.max(newWidth, frozenIntrinsicSize.value.width);
            newHeight = Math.max(newHeight, frozenIntrinsicSize.value.height);

            entity.width = newWidth;
            entity.height = newHeight;
        }
    };

    const onMouseUpResizing = () => {
        if (isResizing.value) {
            isResizing.value = false;
            document.removeEventListener('mousemove', onMouseMoveResizing);
            document.removeEventListener('mouseup', onMouseUpResizing);
        }
    };

    const startResizing = (event) => {
        isResizing.value = true;
        isManuallyResized.value = true;
        startPos.value = { x: event.clientX, y: event.clientY };
        initialSize.value = { width: entity.width, height: entity.height };
        if (elementRef && elementRef.value) {
            frozenIntrinsicSize.value = measureIntrinsicSize(elementRef.value);
        }
        document.addEventListener('mousemove', onMouseMoveResizing);
        document.addEventListener('mouseup', onMouseUpResizing);
    };

    const resetSize = () => {
        if (elementRef && elementRef.value) {
            const naturalSize = measureIntrinsicSize(elementRef.value);
            entity.width = naturalSize.width;
            entity.height = naturalSize.height;
            frozenIntrinsicSize.value = { ...naturalSize };
            isManuallyResized.value = false;
        }
    };

    let autoResizeObserver = null;
    onMounted(() => {
        if (elementRef && elementRef.value) {
            autoResizeObserver = new ResizeObserver((entries) => {
                if (!isResizing.value && !isManuallyResized.value) {
                    for (const entry of entries) {
                        const naturalSize = measureIntrinsicSize(entry.target);
                        if (naturalSize.width > entity.width) {
                            entity.width = naturalSize.width;
                            frozenIntrinsicSize.value.width = naturalSize.width;
                        }
                        if (naturalSize.height > entity.height) {
                            entity.height = naturalSize.height;
                            frozenIntrinsicSize.value.height = naturalSize.height;
                        }
                    }
                }
            });
            autoResizeObserver.observe(elementRef.value);
        }
    });

    onUnmounted(() => {
        if (autoResizeObserver) {
            autoResizeObserver.disconnect();
        }
    });

    return {
        isDragging,
        startDragging,
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized,
    };
}
import { ref, onUnmounted } from 'vue';

export function useDrag({ onStart, onMove, onEnd, onCancel }) {
    const isDragging = ref(false);
    let startEvent, rafId;
    const start = (e) => {
        isDragging.value = true;
        startEvent = e;
        onStart?.(e);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keyup', handleKeyUp);
    };
    const handleMouseMove = (e) => {
        if (!isDragging.value) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => onMove(e, startEvent));
    };
    const handleMouseUp = (e) => {
        if (!isDragging.value) return;
        isDragging.value = false;
        cancelAnimationFrame(rafId);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        onEnd?.(e);
    };
    const handleKeyUp = (e) => {
        if (e.key === 'Escape') {
            isDragging.value = false;
            cancelAnimationFrame(rafId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keyup', handleKeyUp);
            onCancel?.(e);
        }
    }
    onUnmounted(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        cancelAnimationFrame(rafId);
    });
    return { isDragging, start };
}

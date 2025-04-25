import { onMounted, onUnmounted } from 'vue';

export function useResizeObserver(elementRef, callback) {
    let observer;
    onMounted(() => {
        if (elementRef.value) {
            observer = new ResizeObserver(callback);
            observer.observe(elementRef.value);
        }
    });
    onUnmounted(() => {
        observer?.disconnect();
    });
}

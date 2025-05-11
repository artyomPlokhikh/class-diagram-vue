/**
 * Resize Observer Utility
 *
 * Used for auto-sizing elements and responding to content changes.
 */
import { onMounted, onUnmounted } from 'vue';

/**
 * Observes size changes of a DOM element
 *
 * @param {Ref<HTMLElement>} elementRef - Vue ref pointing to the element to observe
 * @param {Function} callback - Callback function that receives ResizeObserverEntry objects
 */
export function useResizeObserver(elementRef, callback) {
    let observer;

    onMounted(() => {
        if (elementRef.value) {
            // Create and attach the ResizeObserver when component mounts
            observer = new ResizeObserver(callback);
            observer.observe(elementRef.value);
        }
    });

    onUnmounted(() => {
        observer?.disconnect();
    });
}

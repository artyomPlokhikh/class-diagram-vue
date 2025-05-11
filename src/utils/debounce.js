/**
 * Creates a debounced version of a function
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 2000ms)
 * @returns {Function} Debounced version of the original function
 */
export function debounce(fn, delay = 2000) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

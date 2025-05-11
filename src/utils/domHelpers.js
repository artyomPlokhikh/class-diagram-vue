/**
 * Measures the natural size of an element without applied width/height constraints
 *
 * This function temporarily removes width and height styles from an element,
 * measures its intrinsic dimensions (including any min-width constraints),
 * and then restores the original styles. This is useful for:
 *
 * - Determining how large entities should be based on their content
 * - Calculating auto-layout positioning
 * - Handling text elements that need to size to their content
 *
 * @param {HTMLElement} el - The element to measure
 * @returns {Object} Object containing the measured width and height
 */
export function measureIntrinsicSize(el) {
    const originalWidth = el.style.width;
    const originalHeight = el.style.height;

    el.style.width = '';
    el.style.height = '';

    const computedStyle = window.getComputedStyle(el);
    const minWidth = parseInt(computedStyle.getPropertyValue('min-width'), 10);

    const measuredWidth = isNaN(minWidth) ? el.offsetWidth : minWidth;
    const measuredHeight = el.offsetHeight;

    el.style.width = originalWidth;
    el.style.height = originalHeight;

    return { width: measuredWidth, height: measuredHeight };
}

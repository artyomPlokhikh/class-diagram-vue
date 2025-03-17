/**
 * Temporarily clears inline width/height on an element,
 * forces a reflow to measure its natural (intrinsic) size,
 * then restores the original inline styles.
 * @param {HTMLElement} el - The DOM element to measure.
 * @returns {Object} The measured intrinsic size { width, height }.
 */
export function measureIntrinsicSize(el) {
    const originalWidth = el.style.width
    const originalHeight = el.style.height
    el.style.width = ''
    el.style.height = ''

    const measuredWidth = el.offsetWidth
    const measuredHeight = el.offsetHeight
    el.style.width = originalWidth
    el.style.height = originalHeight

    return {width: measuredWidth, height: measuredHeight}
}

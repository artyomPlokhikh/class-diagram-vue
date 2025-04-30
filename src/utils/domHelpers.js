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
export function calculateConnectionPoint(entity, border, position) {
    if (!entity) return { x: 0, y: 0 };

    const { x, y, width, height } = entity;

    switch (border) {
        case 'top':
            return { x: x + width * position, y };
        case 'right':
            return { x: x + width, y: y + height * position };
        case 'bottom':
            return { x: x + width * position, y: y + height };
        case 'left':
            return { x, y: y + height * position };
        default:
            return { x, y };
    }
}

export function calculateBorderRelativePosition(rect, borderSide, point = { x: 0, y: 0 }) {
    switch (borderSide) {
        case 'top':
        case 'bottom':
            return Math.max(0, Math.min(1, (point.x - rect.left) / rect.width));
        case 'left':
        case 'right':
            return Math.max(0, Math.min(1, (point.y - rect.top) / rect.height));
        default:
            return 0.5;
    }
};


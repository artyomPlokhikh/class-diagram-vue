export function getEntityConnectionPoints(entity) {
    const { x, y, width, height } = entity;
    return {
        T: [{ x: x + width * 0.25, y: y }, { x: x + width * 0.5, y: y }, { x: x + width * 0.75, y: y }],
        R: [{ x: x + width, y: y + height * 0.25 }, { x: x + width, y: y + height * 0.5 }, {
            x: x + width,
            y: y + height * 0.75
        }],
        B: [{ x: x + width * 0.25, y: y + height }, { x: x + width * 0.5, y: y + height }, {
            x: x + width * 0.75,
            y: y + height
        }],
        L: [{ x: x, y: y + height * 0.25 }, { x: x, y: y + height * 0.5 }, { x: x, y: y + height * 0.75 }]
    };
}

export function offsetPoint(point, side, m) {
    if (side === 'R') return { x: point.x + m, y: point.y }
    if (side === 'L') return { x: point.x - m, y: point.y }
    if (side === 'T') return { x: point.x, y: point.y - m }
    if (side === 'B') return { x: point.x, y: point.y + m }
    return point
}

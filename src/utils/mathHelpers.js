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
}

export function offsetMultiplicity(point, side) {
    const offset = 15;
    switch (side) {
        case 'left':
            return { x: point.x - offset, y: point.y };
        case 'right':
            return { x: point.x + offset, y: point.y };
        case 'top':
            return { x: point.x, y: point.y - offset };
        case 'bottom':
            return { x: point.x, y: point.y + offset };
        default:
            return point;
    }
}

export function calculatePathCenter(points) {
    if (points.length < 2) return { x: 0, y: 0 };

    let totalLength = 0;
    const segments = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        segments.push({
            p1, p2, length, dx, dy
        });
        totalLength += length;
    }

    const halfLength = totalLength / 2;
    let accumulatedLength = 0;

    for (const segment of segments) {
        if (accumulatedLength + segment.length >= halfLength) {
            const t = (halfLength - accumulatedLength) / segment.length;
            return {
                x: segment.p1.x + t * segment.dx,
                y: segment.p1.y + t * segment.dy
            };
        }
        accumulatedLength += segment.length;
    }

    return points[Math.floor((points.length - 1) / 2)];
}

export function calculateDragConnectionPoints(relationship, entities, handleType) {
    const allPoints = [
        calculateConnectionPoint(
            entities.find(e => e.id === relationship.src.id),
            relationship.src.border,
            relationship.src.position
        ),
        ...relationship.bendPoints,
        calculateConnectionPoint(
            entities.find(e => e.id === relationship.trg.id),
            relationship.trg.border,
            relationship.trg.position
        )
    ];

    let startIndex, endIndex;
    if (handleType === 'src') {
        startIndex = 0;
        endIndex = allPoints.length - 1;
    } else {
        startIndex = allPoints.length - 1;
        endIndex = 0;
    }

    let fixedPoint = allPoints[endIndex];
    for (let i = startIndex; handleType === 'src' ? i < allPoints.length : i >= 0; handleType === 'src' ? i++ : i--) {
        if (i !== startIndex && allPoints[i] !== undefined) {
            fixedPoint = allPoints[i];
            break;
        }
    }

    const bendStartIndex = handleType === 'src' ? 0 : relationship.bendPoints.length - 1;
    const removeDirection = handleType === 'src' ? 1 : -1;

    let removeCount = 0;
    for (let i = bendStartIndex;
         handleType === 'src' ? i < relationship.bendPoints.length : i >= 0;
         i += removeDirection) {
        if (relationship.bendPoints[i] === fixedPoint) break;
        removeCount++;
    }

    return {
        fixedPoint,
        removeCount
    };
}

export function findClosestPointOnPath(points, target) {
    let closest = { distance: Infinity, point: null, segmentIndex: -1 };

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const proj = projectPointOnSegment(target, p1, p2);
        const dist = distance(target, proj.point);

        if (dist < closest.distance) {
            closest = {
                distance: dist,
                point: proj.point,
                segmentIndex: i,
                t: proj.t
            };
        }
    }

    return closest;
}

function projectPointOnSegment(point, a, b) {
    const ax = point.x - a.x;
    const ay = point.y - a.y;
    const bx = b.x - a.x;
    const by = b.y - a.y;
    const t = (ax * bx + ay * by) / (bx * bx + by * by);

    return {
        point: {
            x: a.x + bx * Math.max(0, Math.min(1, t)),
            y: a.y + by * Math.max(0, Math.min(1, t))
        },
        t: t
    };
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

export function calculateBorderPreviewPoint(rect, border, mousePos) {
    const svg = document.querySelector('.relationship-svg');
    const pt = svg.createSVGPoint();
    pt.x = mousePos.x;
    pt.y = mousePos.y;
    const svgPos = pt.matrixTransform(svg.getScreenCTM().inverse());

    const position = calculateBorderRelativePosition(rect, border, mousePos);

    let x, y;

    switch (border) {
        case 'top':
            x = rect.left + rect.width * position;
            y = rect.top;
            break;
        case 'right':
            x = rect.right;
            y = rect.top + rect.height * position;
            break;
        case 'bottom':
            x = rect.left + rect.width * position;
            y = rect.bottom;
            break;
        case 'left':
            x = rect.left;
            y = rect.top + rect.height * position;
            break;
    }

    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function getCanvasCoordinates(event, canvasRef, pan, zoom) {
    if (!canvasRef) return { x: 0, y: 0 };

    const rect = canvasRef.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    return { x, y };
}
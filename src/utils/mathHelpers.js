/**
 * Computes the best connection points for two entities (class boxes).
 * Each entity has 4 connection points: Top, Bottom, Left, Right.
 * @param {Object} entityA - { x, y, width, height, id }
 * @param {Object} entityB - { x, y, width, height, id }
 * @returns {Object} Object with properties: start (point on entityA), end (point on entityB), pair (array of keys).
 */
export function getBestConnectionPoints(entityA, entityB) {
    const centerA = {x: entityA.x + entityA.width / 2, y: entityA.y + entityA.height / 2}
    const pointsA = {
        T: {x: centerA.x, y: entityA.y},
        B: {x: centerA.x, y: entityA.y + entityA.height},
        L: {x: entityA.x, y: centerA.y},
        R: {x: entityA.x + entityA.width, y: centerA.y},
    }

    const centerB = {x: entityB.x + entityB.width / 2, y: entityB.y + entityB.height / 2}
    const pointsB = {
        T: {x: centerB.x, y: entityB.y},
        B: {x: centerB.x, y: entityB.y + entityB.height},
        L: {x: entityB.x, y: centerB.y},
        R: {x: entityB.x + entityB.width, y: centerB.y},
    }

    let best = {start: null, end: null, distance: Infinity, pair: null}
    for (const keyA in pointsA) {
        for (const keyB in pointsB) {
            const pA = pointsA[keyA]
            const pB = pointsB[keyB]
            const distance = Math.abs(pA.x - pB.x) + Math.abs(pA.y - pB.y)
            if (distance < best.distance) {
                best = {start: pA, end: pB, distance, pair: [keyA, keyB]}
            }
        }
    }
    return best
}

function pointInsideRect(p, rect) {
    return p.x >= rect.x && p.x <= rect.x + rect.width && p.y >= rect.y && p.y <= rect.y + rect.height
}

function orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
    if (val === 0) return 0
    return val > 0 ? 1 : 2
}

function pointOnSegment(p, q, r) {
    return (
        q.x <= Math.max(p.x, r.x) &&
        q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) &&
        q.y >= Math.min(p.y, r.y)
    )
}

function segmentsIntersect(p1, p2, q1, q2) {
    const o1 = orientation(p1, p2, q1)
    const o2 = orientation(p1, p2, q2)
    const o3 = orientation(q1, q2, p1)
    const o4 = orientation(q1, q2, p2)

    if (o1 !== o2 && o3 !== o4) return true
    if (o1 === 0 && pointOnSegment(p1, q1, p2)) return true
    if (o2 === 0 && pointOnSegment(p1, q2, p2)) return true
    if (o3 === 0 && pointOnSegment(q1, p1, q2)) return true
    if (o4 === 0 && pointOnSegment(q1, p2, q2)) return true
    return false
}

function segmentIntersectsRectangle(p1, p2, rect) {
    if (pointInsideRect(p1, rect) || pointInsideRect(p2, rect)) return true
    const r1 = {x: rect.x, y: rect.y}
    const r2 = {x: rect.x + rect.width, y: rect.y}
    const r3 = {x: rect.x + rect.width, y: rect.y + rect.height}
    const r4 = {x: rect.x, y: rect.y + rect.height}
    return (
        segmentsIntersect(p1, p2, r1, r2) ||
        segmentsIntersect(p1, p2, r2, r3) ||
        segmentsIntersect(p1, p2, r3, r4) ||
        segmentsIntersect(p1, p2, r4, r1)
    )
}

function pathOverlapsEntities(path, obstacles, entityA, entityB) {
    for (const obs of obstacles) {
        if (obs.id === entityA.id || obs.id === entityB.id) continue
        for (let i = 0; i < path.length - 1; i++) {
            if (segmentIntersectsRectangle(path[i], path[i + 1], obs)) {
                return true
            }
        }
    }
    return false
}

/**
 * Calculates a relationship path between two entities.
 * It chooses the routing based on the relative positions of the entities:
 * - For side-by-side entities, it creates a horizontal segment out from the source,
 *   a vertical bend, then a horizontal segment into the target.
 * - For vertically stacked entities, it creates a vertical segment out from the source,
 *   a horizontal bend, then a vertical segment into the target.
 * - For diagonal offsets, it uses two right-angle bends (L-shaped or U-shaped if obstacles exist).
 *
 * @param {Object} entityA - Starting entity { x, y, width, height, id }
 * @param {Object} entityB - Ending entity { x, y, width, height, id }
 * @param {Array} obstacles - Array of other entities to avoid (optional)
 * @returns {Array} Array of points forming the routing path.
 */
export function calculateRelationshipPath(entityA, entityB, obstacles = []) {
    const centerA = {x: entityA.x + entityA.width / 2, y: entityA.y + entityA.height / 2}
    const centerB = {x: entityB.x + entityB.width / 2, y: entityB.y + entityB.height / 2}
    const dx = centerB.x - centerA.x
    const dy = centerB.y - centerA.y

    if (Math.abs(dx) > Math.abs(dy)) {
        let start, end
        if (dx > 0) {
            start = {x: entityA.x + entityA.width, y: centerA.y}
            end = {x: entityB.x, y: centerB.y}
        } else {
            start = {x: entityA.x, y: centerA.y}
            end = {x: entityB.x + entityB.width, y: centerB.y}
        }
        const midX = (start.x + end.x) / 2
        const point1 = {x: midX, y: start.y}
        const point2 = {x: midX, y: end.y}
        return [start, point1, point2, end]
    } else if (Math.abs(dy) > Math.abs(dx)) {
        let start, end
        if (dy > 0) {
            start = {x: centerA.x, y: entityA.y + entityA.height}
            end = {x: centerB.x, y: entityB.y}
        } else {
            start = {x: centerA.x, y: entityA.y}
            end = {x: centerB.x, y: entityB.y + entityB.height}
        }
        const midY = (start.y + end.y) / 2
        const point1 = {x: start.x, y: midY}
        const point2 = {x: end.x, y: midY}
        return [start, point1, point2, end]
    } else {
        const best = getBestConnectionPoints(entityA, entityB)
        const start = best.start
        const end = best.end
        const option1 = [start, {x: end.x, y: start.y}, end]
        const option2 = [start, {x: start.x, y: end.y}, end]
        const option1Valid = !pathOverlapsEntities(option1, obstacles, entityA, entityB)
        const option2Valid = !pathOverlapsEntities(option2, obstacles, entityA, entityB)
        if (option1Valid && option2Valid) {
            return option1
        } else if (option1Valid) {
            return option1
        } else if (option2Valid) {
            return option2
        } else {
            const margin = 25
            const offsetX = start.x < end.x ? margin : -margin
            const intermediate1 = {x: start.x + offsetX, y: start.y}
            const intermediate2 = {x: start.x + offsetX, y: end.y}
            return [start, intermediate1, intermediate2, end]
        }
    }
}

/**
 * Adjusts a custom path’s endpoints given new start and end points.
 * It interpolates the intermediate points to preserve the relative shape.
 * @param {Array} oldPath - The original custom path (array of {x, y} points)
 * @param {Object} newStart - The new starting point {x, y}
 * @param {Object} newEnd - The new ending point {x, y}
 * @returns {Array} Adjusted path (array of {x, y} points)
 */
export function adjustPathEndpoints(oldPath, newStart, newEnd) {
    const n = oldPath.length
    if (n < 2) return oldPath
    const deltaStart = {
        x: newStart.x - oldPath[0].x,
        y: newStart.y - oldPath[0].y,
    }
    const deltaEnd = {
        x: newEnd.x - oldPath[n - 1].x,
        y: newEnd.y - oldPath[n - 1].y,
    }
    return oldPath.map((pt, i) => {
        const t = i / (n - 1)
        return {
            x: pt.x + deltaStart.x * (1 - t) + deltaEnd.x * t,
            y: pt.y + deltaStart.y * (1 - t) + deltaEnd.y * t,
        }
    })
}

/**
 * Returns three candidate connection points (ports) for each side of an entity.
 * The entity is assumed to have properties: x, y, width, height.
 * The returned object has four keys: T, R, B, L for top, right, bottom, and left.
 *
 * For example, the top side returns:
 * [
 *   { x: entity.x + width * 0.25, y: entity.y },
 *   { x: entity.x + width * 0.5,  y: entity.y },
 *   { x: entity.x + width * 0.75, y: entity.y }
 * ]
 *
 * @param {Object} entity - { x, y, width, height, id }
 * @returns {Object} Object with keys T, R, B, L (each an array of 3 points)
 */
export function getEntityConnectionPoints(entity) {
    const {x, y, width, height} = entity;
    return {
        T: [
            {x: x + width * 0.25, y: y},
            {x: x + width * 0.5, y: y},
            {x: x + width * 0.75, y: y}
        ],
        R: [
            {x: x + width, y: y + height * 0.25},
            {x: x + width, y: y + height * 0.5},
            {x: x + width, y: y + height * 0.75}
        ],
        B: [
            {x: x + width * 0.25, y: y + height},
            {x: x + width * 0.5, y: y + height},
            {x: x + width * 0.75, y: y + height}
        ],
        L: [
            {x: x, y: y + height * 0.25},
            {x: x, y: y + height * 0.5},
            {x: x, y: y + height * 0.75}
        ]
    };
}

export function offsetPoint(point, side, m) {
    if (side === 'R') return { x: point.x + m, y: point.y }
    if (side === 'L') return { x: point.x - m, y: point.y }
    if (side === 'T') return { x: point.x, y: point.y - m }
    if (side === 'B') return { x: point.x, y: point.y + m }
    return point
}

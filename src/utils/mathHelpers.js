/**
 * Returns a simple orthogonal (Manhattan-style) path between two points.
 * If the points share an x or y coordinate, it returns a straight line;
 * otherwise it returns a path with one bend.
 * @param {Object} source - {x, y}
 * @param {Object} target - {x, y}
 * @returns {Array} Array of point objects.
 */
export function calculateOrthogonalPath(source, target) {
    if (source.x === target.x || source.y === target.y) {
        return [source, target];
    }
    return [source, {x: target.x, y: source.y}, target];
}

/**
 * Calculates the connection point on an entity's border that best faces the target.
 * Assumes entity.x and entity.y are the top-left coordinates.
 * @param {Object} entity - { x, y, width, height }
 * @param {Object} targetEntity - { x, y, width, height }
 * @returns {Object} The connection point { x, y }.
 */
export function getConnectionPoint(entity, targetEntity) {
    const center = {
        x: entity.x + entity.width / 2,
        y: entity.y + entity.height / 2
    };
    const targetCenter = {
        x: targetEntity.x + targetEntity.width / 2,
        y: targetEntity.y + targetEntity.height / 2
    };
    const dx = targetCenter.x - center.x;
    const dy = targetCenter.y - center.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0
            ? {x: entity.x + entity.width, y: center.y}
            : {x: entity.x, y: center.y};
    } else {
        return dy > 0
            ? {x: center.x, y: entity.y + entity.height}
            : {x: center.x, y: entity.y};
    }
}

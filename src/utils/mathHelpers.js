/**
 * Math Helper Functions for Diagram Geometry
 *
 * This utility module provides mathematical functions for calculating positions,
 * intersections, projections, and other geometric operations required for the diagram editor.
 * These functions handle connection points between entities, border interactions, path calculations,
 * and coordinate transformations essential for proper diagram rendering and interaction.
 */

/**
 * Calculates the exact point where a connection should attach to an element's border
 * @param {Object} diagramElement - The element (entity, note, etc.) to connect to
 * @param {string} border - Which border to connect to ('top', 'right', 'bottom', 'left')
 * @param {number} position - Relative position along the border (0-1)
 * @returns {Object} Coordinates {x, y} of the connection point
 */
export function calculateConnectionPoint(diagramElement, border, position) {
    if (!diagramElement) return { x: 0, y: 0 };

    const { x, y, width, height } = diagramElement;

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

/**
 * Determines the relative position (0-1) along a specific border based on an absolute point
 * Used for calculating where relationships should connect to entities
 *
 * @param {Object} rect - Rectangle coordinates and dimensions
 * @param {string} borderSide - Which border to use ('top', 'right', 'bottom', 'left')
 * @param {Object} point - Absolute coordinates to calculate from
 * @returns {number} Relative position along the border (clamped between 0-1)
 */
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

/**
 * Calculates an offset position for displaying relationship multiplicity labels
 * Positions the label away from the connection point in a direction that depends on which border is used
 *
 * @param {Object} point - Base connection point
 * @param {string} side - Which border side the connection is on
 * @returns {Object} Offset coordinates for the multiplicity label
 */
export function offsetMultiplicity(point, side) {
    const offset = 20;
    switch (side) {
        case 'left':
            return { x: point.x - offset, y: point.y + offset};
        case 'right':
            return { x: point.x + offset, y: point.y + offset};
        case 'top':
            return { x: point.x - offset, y: point.y - offset };
        case 'bottom':
            return { x: point.x - offset, y: point.y + offset };
        default:
            return point;
    }
}

/**
 * Finds the center point of a multi-segment path
 * Used for positioning relationship labels at the middle of connecting lines
 *
 * @param {Array} points - Array of points defining the path
 * @returns {Object} Coordinates of the center point of the path
 */
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

/**
 * Finds the point on a path closest to a target point
 * Used for determining where a user is clicking/hovering on a path
 *
 * @param {Array} points - Array of points defining the path
 * @param {Object} target - Target point to find the closest point to
 * @returns {Object} Data about the closest point including distance, coordinates, and segment info
 */
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

/**
 * Projects a point onto a line segment and calculates the relative position
 * Helper function for findClosestPointOnPath
 *
 * @param {Object} point - Point to project
 * @param {Object} a - Start point of the line segment
 * @param {Object} b - End point of the line segment
 * @returns {Object} Projected point and relative position (t) along segment
 */
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

/**
 * Calculates the Euclidean distance between two points
 *
 * @param {Object} a - First point
 * @param {Object} b - Second point
 * @returns {number} Distance between the points
 */
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Calculates preview point when drawing new relationships
 * Converts mouse coordinates to SVG coordinates and finds the proper attachment point
 *
 * @param {Object} rect - Rectangle representing the entity
 * @param {string} border - Border side to attach to
 * @param {Object} mousePos - Current mouse position
 * @returns {Object} SVG coordinates for the preview point
 */
export function calculateBorderPreviewPoint(rect, border, mousePos) {
    const svg = document.querySelector('.diagram-canvas__preview-svg');
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

/**
 * Converts viewport (screen) coordinates to diagram coordinates
 * Accounts for panning and zoom level
 *
 * @param {Event} event - Mouse/touch event
 * @param {HTMLElement} canvasRef - Reference to the canvas element
 * @param {Object} pan - Current pan position {x, y}
 * @param {number} zoom - Current zoom level
 * @returns {Object} Coordinates in diagram space
 */
export function calculateContainerCoordinates(event, canvasRef, pan, zoom) {
    if (!canvasRef) return { x: 0, y: 0 };

    const rect = canvasRef.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;

    return { x, y };
}

/**
 * Constrains a point to be orthogonal to a fixed point
 * Used for creating straight horizontal or vertical line segments
 *
 * @param {Object} rawPos - Unconstrained position
 * @param {Object} fixedPoint - Reference point to align with
 * @returns {Object} Position constrained to be horizontally or vertically aligned
 */
export function calculateOrthogonalPosition(rawPos, fixedPoint) {
    const deltaX = rawPos.x - fixedPoint.x;
    const deltaY = rawPos.y - fixedPoint.y;

    return Math.abs(deltaX) > Math.abs(deltaY)
        ? { x: rawPos.x, y: fixedPoint.y }
        : { x: fixedPoint.x, y: rawPos.y };
}

/**
 * Calculates the bounding box for all diagram elements
 * Used for features like "fit to screen" and determining export dimensions
 *
 * @param {Array} elements - Array of diagram elements
 * @returns {Object} Bounding box with x, y, width, height
 */
export const calculateDiagramBounds = (elements) => {
    if (!elements || elements.length === 0) return { x: 0, y: 0, width: 800, height: 600 };

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let validElementFound = false;

    elements.forEach(element => {
        if (element.x === undefined || element.y === undefined) return;
        
        validElementFound = true;

        if (element.width !== undefined && element.height !== undefined) {
            minX = Math.min(minX, element.x);
            minY = Math.min(minY, element.y);
            maxX = Math.max(maxX, element.x + element.width);
            maxY = Math.max(maxY, element.y + element.height);
        } else {
            minX = Math.min(minX, element.x);
            minY = Math.min(minY, element.y);
            maxX = Math.max(maxX, element.x);
            maxY = Math.max(maxY, element.y);
        }
    });
    
    if (!validElementFound || minX === Infinity || minY === Infinity) {
        return { x: 0, y: 0, width: 800, height: 600 };
    }

    const width = Math.max(maxX - minX, 10);
    const height = Math.max(maxY - minY, 10);
    
    return {
        x: minX,
        y: minY,
        width: width,
        height: height
    };
};

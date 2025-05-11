/**
 * Element Snapping System
 *
 * This composable provides snapping functionality for diagram elements. It:
 * - Identifies potential snap lines from all existing diagram elements
 * - Computes both vertical and horizontal alignment guides
 * - Provides visual guides during element movement
 * - Snaps elements to each other's edges within a configurable threshold
 * - Supports bypassing snapping with modifier keys
 */
import { computed, reactive } from 'vue';

export function useSnapping(diagramStore, ctrlPressed, threshold = 8) {
    /**
     * Generates vertical snap lines from all diagram elements
     * Collects both left (x) and right (x+width) edges of all rectangles
     * and x-coordinates of relationship bend points
     */
    const verticalData = computed(() => {
        const lines = [], sources = [];
        diagramStore.rectangles.forEach(r => {
            lines.push(r.x);
            sources.push(r.id);
            lines.push(r.x + r.width);
            sources.push(r.id);
        });
        diagramStore.relationships.forEach(r =>
            r.bendPoints.forEach(p => {
                lines.push(p.x);
                sources.push(r.id);
            })
        );
        return { lines, sources };
    });


    /**
     * Generates horizontal snap lines from all diagram elements
     * Collects both top (y) and bottom (y+height) edges of all rectangles
     * and y-coordinates of relationship bend points
     */
    const horizontalData = computed(() => {
        const lines = [], sources = [];
        diagramStore.rectangles.forEach(r => {
            lines.push(r.y);
            sources.push(r.id);
            lines.push(r.y + r.height);
            sources.push(r.id);
        });
        diagramStore.relationships.forEach(r =>
            r.bendPoints.forEach(p => {
                lines.push(p.y);
                sources.push(r.id);
            })
        );
        return { lines, sources };
    });


    const guides = reactive({ segments: [] });
    let active = false;
    let bbox = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };


    /**
     * Starts the snapping system for a specific element
     * Captures the element's bounding box for snap calculations
     *
     * @param {Object} box - The bounding box of the element being moved
     */
    function start(box) {
        active = true;
        bbox = {
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            right: box.left + box.width,
            bottom: box.top + box.height
        };
    }

    function stop() {
        active = false;
        guides.segments.length = 0;
    }


    /**
     * Core snapping function that adjusts coordinates based on nearby snap lines
     *
     * This function:
     * 1. Checks if snapping is active and not bypassed with Ctrl key
     * 2. Compares element edges with potential snap lines
     * 3. Creates visual guide lines for active snaps
     * 4. Returns adjusted coordinates for the best snap match
     *
     * @param {Object} raw - Raw {x,y} coordinates before snapping
     * @param {string|null} bypassId - ID of an element to ignore in snapping (prevents self-snapping)
     * @param {string} axis - Which axis to snap ('both', 'x', or 'y')
     * @returns {Object} Adjusted {x,y} coordinates after snapping
     */
    function snapPoint(raw, bypassId = null, axis = 'both') {
        if (!active || ctrlPressed.value) {
            guides.segments.length = 0;
            return raw;
        }

        const ox = raw.x;
        const oy = raw.y;
        let x = ox;
        let y = oy;

        guides.segments.length = 0;

        if (axis === 'both' || axis === 'x') {
            const { lines, sources } = verticalData.value;
            const candidates = [];
            const rawR = ox + bbox.width;

            // Check for snap candidates on both left and right edges
            for (let i = 0; i < lines.length; i++) {
                if (bypassId && sources[i] === bypassId) continue;
                const v = lines[i];
                if (Math.abs(v - ox) < threshold) {
                    guides.segments.push({ x1: v, y1: bbox.top, x2: v, y2: bbox.bottom });
                    candidates.push({ snapX: v, dist: Math.abs(v - ox) });
                }
                if (Math.abs(v - rawR) < threshold) {
                    guides.segments.push({ x1: v, y1: bbox.top, x2: v, y2: bbox.bottom });
                    candidates.push({ snapX: v - bbox.width, dist: Math.abs(v - rawR) });
                }
            }

            // Apply the best snap match if any
            if (candidates.length) {
                const best = candidates.reduce((a, b) => a.dist < b.dist ? a : b);
                x = best.snapX;
            }
        }

        if (axis === 'both' || axis === 'y') {
            const { lines, sources } = horizontalData.value;
            const candidates = [];
            const rawB = oy + bbox.height;

            // Check for snap candidates on both top and bottom edges
            for (let i = 0; i < lines.length; i++) {
                if (bypassId && sources[i] === bypassId) continue;
                const h = lines[i];
                if (Math.abs(h - oy) < threshold) {
                    guides.segments.push({ x1: bbox.left, x2: bbox.right, y1: h, y2: h });
                    candidates.push({ snapY: h, dist: Math.abs(h - oy) });
                }
                if (Math.abs(h - rawB) < threshold) {
                    guides.segments.push({ x1: bbox.left, x2: bbox.right, y1: h, y2: h });
                    candidates.push({ snapY: h - bbox.height, dist: Math.abs(h - rawB) });
                }
            }

            // Apply the best snap match if any
            if (candidates.length) {
                const best = candidates.reduce((a, b) => a.dist < b.dist ? a : b);
                y = best.snapY;
            }
        }

        return { x, y };
    }


    return { start, stop, snapPoint, guides };
}

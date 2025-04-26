import { computed, reactive } from 'vue';

export function useSnapping(diagramStore, ctrlPressed, threshold = 8) {
    const verticalData = computed(() => {
        const lines = [], sources = [];
        diagramStore.entities.forEach(e => {
            lines.push(e.x);             sources.push(e.id);
            lines.push(e.x + e.width);   sources.push(e.id);
        });
        diagramStore.relationships.forEach(r =>
            r.bendPoints.forEach(p => {
                lines.push(p.x); sources.push(r.id);
            })
        );
        return { lines, sources };
    });


    const horizontalData = computed(() => {
        const lines = [], sources = [];
        diagramStore.entities.forEach(e => {
            lines.push(e.y);              sources.push(e.id);
            lines.push(e.y + e.height);   sources.push(e.id);
        });
        diagramStore.relationships.forEach(r =>
            r.bendPoints.forEach(p => {
                lines.push(p.y); sources.push(r.id);
            })
        );
        return { lines, sources };
    });


    const guides = reactive({ segments: [] });
    let active = false;
    let bbox = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };


    function start(box) {
        active = true;
        bbox = {
            left:   box.left,
            top:    box.top,
            width:  box.width,
            height: box.height,
            right:  box.left + box.width,
            bottom: box.top  + box.height
        };
    }
    function stop() {
        active = false;
        guides.segments.length = 0;
    }


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

            for (let i = 0; i < lines.length; i++) {
                if (bypassId && sources[i] === bypassId) continue;
                const v = lines[i];
                if (Math.abs(v - ox) < threshold) {
                    guides.segments.push({ x1: v, y1: bbox.top,    x2: v, y2: bbox.bottom });
                    candidates.push({ snapX: v, dist: Math.abs(v - ox) });
                }
                if (Math.abs(v - rawR) < threshold) {
                    guides.segments.push({ x1: v, y1: bbox.top,    x2: v, y2: bbox.bottom });
                    candidates.push({ snapX: v - bbox.width, dist: Math.abs(v - rawR) });
                }
            }

            if (candidates.length) {
                const best = candidates.reduce((a, b) => a.dist < b.dist ? a : b);
                x = best.snapX;
            }
        }

        if (axis === 'both' || axis === 'y') {
            const { lines, sources } = horizontalData.value;
            const candidates = [];
            const rawB = oy + bbox.height;

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

            if (candidates.length) {
                const best = candidates.reduce((a, b) => a.dist < b.dist ? a : b);
                y = best.snapY;
            }
        }

        return { x, y };
    }


    return { start, stop, snapPoint, guides };
}

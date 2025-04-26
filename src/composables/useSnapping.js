import { computed, reactive } from 'vue';

export function useSnapping(diagramStore, ctrlPressed, threshold = 8) {

    const verticalData = computed(() => {
        const lines = [], sources = [];
        diagramStore.entities.forEach(e => {
            lines.push(e.x);               sources.push(e.id);
            lines.push(e.x + e.width);     sources.push(e.id);
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
            lines.push(e.y);               sources.push(e.id);
            lines.push(e.y + e.height);    sources.push(e.id);
        });
        diagramStore.relationships.forEach(r =>
            r.bendPoints.forEach(p => {
                lines.push(p.y); sources.push(r.id);
            })
        );
        return { lines, sources };
    });

    const guides = reactive({ vSegments: [], hSegments: [] });
    let active = false, bbox = null;

    function start(box) {
        active = true;
        bbox = box;
    }

    function stop() {
        active = false;
        bbox = null;
        guides.vSegments.length = 0;
        guides.hSegments.length = 0;
    }

    function snapPoint(raw, bypassId = null, axis = 'both') {
        if (!active || ctrlPressed.value) {
            guides.vSegments.length = 0;
            guides.hSegments.length = 0;
            return raw;
        }

        let x = raw.x, y = raw.y;
        guides.vSegments.length = 0;
        if (axis === 'both' || axis === 'x') {
            const { lines, sources } = verticalData.value;
            const near = [];
            for (let i = 0; i < lines.length; i++) {
                if (bypassId && sources[i] === bypassId) continue;
                const v = lines[i];
                if (Math.abs(v - raw.x) < threshold) {
                    near.push(v);
                    guides.vSegments.push({ x: v, y1: bbox.top,    y2: bbox.bottom });
                }
            }
            if (near.length) {
                x = near.reduce((a, b) =>
                    Math.abs(a - raw.x) < Math.abs(b - raw.x) ? a : b
                );
            }
        }

        guides.hSegments.length = 0;
        if (axis === 'both' || axis === 'y') {
            const { lines, sources } = horizontalData.value;
            const near = [];
            for (let i = 0; i < lines.length; i++) {
                if (bypassId && sources[i] === bypassId) continue;
                const h = lines[i];
                if (Math.abs(h - raw.y) < threshold) {
                    near.push(h);
                    guides.hSegments.push({ y: h, x1: bbox.left, x2: bbox.right });
                }
            }
            if (near.length) {
                y = near.reduce((a, b) =>
                    Math.abs(a - raw.y) < Math.abs(b - raw.y) ? a : b
                );
            }
        }

        return { x, y };
    }

    return { start, stop, snapPoint, guides };
}

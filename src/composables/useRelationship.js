import { computed, inject, ref } from 'vue';
import { getEntityConnectionPoints, offsetPoint } from '@/utils/mathHelpers';
import Relationship from '@/models/Relationship.js';

export function useRelationship(relationship) {
    const entities = inject('entities', { value: [] });
    const sourceEntity = computed(() => entities.value.find(e => e.id === relationship.source?.id));
    const targetEntity = computed(() => entities.value.find(e => e.id === relationship.target?.id));
    const MARGIN = 10;

    if (!relationship.source?.port && sourceEntity.value) {
        const { x: ax, y: ay, width: aw, height: ah } = sourceEntity.value;
        const centerA = { x: ax + aw / 2, y: ay + ah / 2 };
        let dx = 1, dy = 0;
        if (targetEntity.value) {
            const { x: bx, y: by, width: bw, height: bh } = targetEntity.value;
            const centerB = { x: bx + bw / 2, y: by + bh / 2 };
            dx = centerB.x - centerA.x;
            dy = centerB.y - centerA.y;
        }
        const side = Math.abs(dx) >= Math.abs(dy) ? dx >= 0 ? 'R' : 'L' : dy >= 0 ? 'B' : 'T';
        relationship.source = {
            id: sourceEntity.value.id, port: { side, index: 1 }
        };
    }

    const chosenConnection = computed(() => {
        if (!sourceEntity.value || !targetEntity.value || !relationship.source?.port) {
            return null;
        }
        const sourcePts = getEntityConnectionPoints(sourceEntity.value);
        const lockedSource = sourcePts[relationship.source.port.side][relationship.source.port.index];
        const targetPtsMap = getEntityConnectionPoints(targetEntity.value);
        const allTargets = Object.entries(targetPtsMap).flatMap(([side, arr]) => arr.map(pt => ({ pt, side })));
        const best = allTargets.reduce((bestSoFar, { pt, side }) => {
            const cost = Math.abs(pt.x - lockedSource.x) + Math.abs(pt.y - lockedSource.y);
            return cost < bestSoFar.cost ? { cost, pt, side } : bestSoFar;
        }, { cost: Infinity, pt: null, side: null });
        return {
            source: lockedSource, target: best.pt, sourceSide: relationship.source.port.side, targetSide: best.side
        };
    });

    const autoPoints = computed(() => {
        const conn = chosenConnection.value;
        if (!conn) return [];
        const { source, target, sourceSide, targetSide } = conn;
        const start = offsetPoint(source, sourceSide, MARGIN);
        const end = offsetPoint(target, targetSide, MARGIN);
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        if (sourceSide === 'T' || sourceSide === 'B') {
            return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
        }
        return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
    });

    const manualPoints = ref([]);

    function addManualPoint(evt) {
        const svg = evt.target.ownerSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
        const pts = autoPoints.value;
        const best = pts.slice(0, -1).reduce((bestSoFar, curr, i) => {
            const next = pts[i + 1];
            const dx = next.x - curr.x;
            const dy = next.y - curr.y;
            const t = ((loc.x - curr.x) * dx + (loc.y - curr.y) * dy) / (dx * dx + dy * dy);
            const tc = Math.max(0, Math.min(1, t));
            const projX = curr.x + tc * dx;
            const projY = curr.y + tc * dy;
            const dist = Math.hypot(loc.x - projX, loc.y - projY);
            return dist < bestSoFar.dist ? { dist, idx: i } : bestSoFar;
        }, { dist: Infinity, idx: 0 });
        manualPoints.value.push({ idx: best.idx, x: loc.x, y: loc.y });
    }

    const pathPoints = computed(() => {
        const pts = [...autoPoints.value];
        manualPoints.value.forEach(({ idx, x, y }) => {
            pts.splice(idx + 1, 0, { x, y });
        });
        return pts;
    });

    const path = computed(() => pathPoints.value.map(p => `${p.x},${p.y}`).join(' '));
    const sourcePoint = computed(() => pathPoints.value[0] || { x: 0, y: 0 });
    const targetPoint = computed(() => {
        const pts = pathPoints.value;
        return pts.length ? pts[pts.length - 1] : { x: 0, y: 0 };
    });

    const markerStart = computed(() => {
        switch (relationship.type) {
            case Relationship.TYPES.COMPOSITION:
                return 'url(#filled_diamond)';
            case Relationship.TYPES.AGGREGATION:
                return 'url(#empty_diamond)';
            default:
                return null;
        }
    });

    const markerEnd = computed(() => {
        switch (relationship.type) {
            case Relationship.TYPES.INHERITANCE:
                return 'url(#triangle)';
            case Relationship.TYPES.ASSOCIATION:
            case Relationship.TYPES.DEPENDENCY:
                return 'url(#arrowhead)';
            default:
                return null;
        }
    });

    const strokeDasharray = computed(() => relationship.type === Relationship.TYPES.DEPENDENCY ? '5,5' : null);

    const labelPoint = computed(() => {
        const pts = pathPoints.value;
        const i = Math.floor((pts.length - 1) / 2);
        return pts[i] || { x: 0, y: 0 };
    });

    const sourceMultiplicityPoint = computed(() => sourcePoint.value);
    const targetMultiplicityPoint = computed(() => targetPoint.value);

    return {
        path,
        sourcePoint,
        targetPoint,
        markerStart,
        markerEnd,
        strokeDasharray,
        labelPoint,
        sourceMultiplicityPoint,
        targetMultiplicityPoint,
        addManualPoint
    };
}

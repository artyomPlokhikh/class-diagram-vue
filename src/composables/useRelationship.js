import { computed, inject, ref } from 'vue'
import { getEntityConnectionPoints, offsetPoint } from '@/utils/mathHelpers'
import Relationship from "@/models/Relationship.js";


export function useRelationship(relationship) {
    const entities = inject('entities', { value: [] });
    const sourceEntity = computed(() => entities.value.find(e => e.id === relationship.source?.id));
    const targetEntity = computed(() => entities.value.find(e => e.id === relationship.target?.id));
    const lineOffset = ref(0);
    const margin = 0;

    if ((!relationship.source || !relationship.source.port) && sourceEntity.value) {
        const centerA = {
            x: sourceEntity.value.x + sourceEntity.value.width / 2,
            y: sourceEntity.value.y + sourceEntity.value.height / 2
        };
        let dx = 1, dy = 0;
        if (targetEntity.value) {
            const centerB = {
                x: targetEntity.value.x + targetEntity.value.width / 2,
                y: targetEntity.value.y + targetEntity.value.height / 2
            };
            dx = centerB.x - centerA.x;
            dy = centerB.y - centerA.y;
        }
        let side = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 'R' : 'L') : (dy >= 0 ? 'B' : 'T');
        relationship.source = { id: sourceEntity.value.id, port: { side, index: 1 } };
    }

    const chosenConnection = computed(() => {
        if (!sourceEntity.value || !targetEntity.value || !relationship.source || !relationship.source.port) return null
        const sourceCandidates = getEntityConnectionPoints(sourceEntity.value);
        const lockedSource = sourceCandidates[relationship.source.port.side][relationship.source.port.index];
        const targetCandidates = getEntityConnectionPoints(targetEntity.value);
        let bestCandidate = null, bestSide = null, bestCost = Infinity;
        for (const s in targetCandidates) {
            targetCandidates[s].forEach(candidate => {
                const cost = Math.abs(candidate.x - lockedSource.x) + Math.abs(candidate.y - lockedSource.y);
                if (cost < bestCost) {
                    bestCost = cost;
                    bestCandidate = candidate;
                    bestSide = s;
                }
            })
        }
        const dx = bestCandidate.x - lockedSource.x;
        const dy = bestCandidate.y - lockedSource.y;
        const orientation = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
        return {
            source: lockedSource,
            target: bestCandidate,
            sourceSide: relationship.source.port.side,
            targetSide: bestSide,
            orientation
        };
    });

    const pathPoints = computed(() => {
        if (!chosenConnection.value || !sourceEntity.value || !targetEntity.value) return [];
        const { source, target, sourceSide, targetSide } = chosenConnection.value;
        const centerA = {
            x: sourceEntity.value.x + sourceEntity.value.width / 2,
            y: sourceEntity.value.y + sourceEntity.value.height / 2
        };
        const centerB = {
            x: targetEntity.value.x + targetEntity.value.width / 2,
            y: targetEntity.value.y + targetEntity.value.height / 2
        };
        const dxCenter = centerB.x - centerA.x;
        const dyCenter = centerB.y - centerA.y;
        let routingType = "diagonal";
        if (Math.abs(dxCenter) > Math.abs(dyCenter) * 1.5) routingType = "sideBySide";
        else if (Math.abs(dyCenter) > Math.abs(dxCenter) * 1.5) routingType = "stacked";
        const start = offsetPoint(source, sourceSide, margin);
        const end = offsetPoint(target, targetSide, margin);
        if (routingType === "sideBySide") {
            const midX = (start.x + end.x) / 2;
            return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
        } else if (routingType === "stacked") {
            const midY = (start.y + end.y) / 2;
            return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
        } else {
            const midX = (start.x + end.x) / 2;
            return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
        }
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
                return 'url(#arrowhead)';
            case Relationship.TYPES.DEPENDENCY:
                return 'url(#arrowhead)';
            default:
                return null;
        }
    });

    const strokeDasharray = computed(() =>
        relationship.type === Relationship.TYPES.DEPENDENCY ? '5,5' : null
    );

    const labelPoint = computed(() => {
        const pts = pathPoints.value
        if (!pts || !pts.length) return { x: 0, y: 0 }
        const midIdx = Math.floor((pts.length - 1) / 2)
        return pts[midIdx]
    })

    const LABEL_OFFSET = 50;

    const sourceMultiplicityPoint = computed(() => {
        const pts = pathPoints.value;
        if (pts.length < 2) return pts[0] || { x: 0, y: 0 };

        const p0 = pts[0];
        const p1 = pts[1];
        const dx = p0.x - p1.x;
        const dy = p0.y - p1.y;
        const len = Math.hypot(dx, dy) || 1;

        return {
            x: p0.x + (dx / len) * LABEL_OFFSET,
            y: p0.y + (dy / len) * LABEL_OFFSET
        };
    });

    const targetMultiplicityPoint = computed(() => {
        const pts = pathPoints.value;
        const n = pts.length;
        if (n < 2) return pts[n - 1] || { x: 0, y: 0 };

        const pN = pts[n - 1];
        const pNm1 = pts[n - 2];
        const dx = pN.x - pNm1.x;
        const dy = pN.y - pNm1.y;
        const len = Math.hypot(dx, dy) || 1;

        return {
            x: pN.x + (dx / len) * LABEL_OFFSET,
            y: pN.y + (dy / len) * LABEL_OFFSET
        };
    });


    const path = computed(() => pathPoints.value.map(p => `${p.x},${p.y}`).join(' '));
    const sourcePoint = computed(() => pathPoints.value[0] || { x: 0, y: 0 });
    const targetPoint = computed(() => pathPoints.value.length ? pathPoints.value[pathPoints.value.length - 1] : {
        x: 0,
        y: 0
    });


    return {
        path,
        pathPoints,
        sourcePoint,
        targetPoint,
        lineOffset,
        chosenConnection,
        markerStart,
        markerEnd,
        strokeDasharray,
        labelPoint,
        sourceMultiplicityPoint,
        targetMultiplicityPoint
    };
}

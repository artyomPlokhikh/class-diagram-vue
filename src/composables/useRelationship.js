import { computed, inject } from 'vue';
import {
    calculateConnectionPoint,
    calculatePathCenter,
    findClosestPointOnPath,
    offsetMultiplicity
} from '@/utils/mathHelpers.js';
import Relationship from '@/models/Relationship.js';

export function useRelationship(relationship) {
    const diagramStore = inject('diagramStore');
    const srcEntity = computed(() => diagramStore.entities.find(e => e.id === relationship.src?.id));
    const trgEntity = computed(() => diagramStore.entities.find(e => e.id === relationship.trg?.id));

    const srcPoint = computed(() => calculateConnectionPoint(srcEntity.value, relationship.src.border, relationship.src.position));
    const trgPoint = computed(() => calculateConnectionPoint(trgEntity.value, relationship.trg.border, relationship.trg.position));
    const allPoints = computed(() => [srcPoint.value, ...relationship.bendPoints, trgPoint.value]);

    const path = computed(() => {
        if (!srcPoint.value || !trgPoint.value) return '';
        if (relationship.bendPoints.length > 0) {
            const pts = [
                `${srcPoint.value.x},${srcPoint.value.y}`,
                ...relationship.bendPoints.map(p => `${p.x},${p.y}`),
                `${trgPoint.value.x},${trgPoint.value.y}`
            ];
            return pts.join(' ');
        }
        return `${srcPoint.value.x},${srcPoint.value.y} ${trgPoint.value.x},${trgPoint.value.y}`;
    });

    const addBendPoint = (event) => {
        const svg = event.target.ownerSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const mousePos = pt.matrixTransform(svg.getScreenCTM().inverse());
        const closest = findClosestPointOnPath(allPoints.value, mousePos);
        relationship.bendPoints.splice(closest.segmentIndex, 0, closest.point);

        diagramStore.save();
    };

    const removeBendPoint = (index) => {
        relationship.bendPoints.splice(index, 1);
        diagramStore.save();
    };

    const labelPos = computed(() => calculatePathCenter(allPoints.value));
    const srcMultPos = computed(() => offsetMultiplicity(srcPoint.value, relationship.src.border));
    const trgMultPos = computed(() => offsetMultiplicity(trgPoint.value, relationship.trg.border));

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
            case Relationship.TYPES.DEPENDENCY:
                return 'url(#arrowhead)';
            case Relationship.TYPES.ASSOCIATION:
                return null;
            default:
                return null;
        }
    });

    const strokeDasharray = computed(() => {
        switch (relationship.type) {
            case Relationship.TYPES.DEPENDENCY:
                return '5,5';
            default:
                return null;
        }
    });

    return {
        srcPoint,
        trgPoint,
        path,
        allPoints,
        addBendPoint,
        removeBendPoint,
        labelPos,
        srcMultPos,
        trgMultPos,
        markerStart,
        markerEnd,
        strokeDasharray
    };
}

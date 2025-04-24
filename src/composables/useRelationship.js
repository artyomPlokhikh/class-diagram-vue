import { computed, inject } from 'vue';
import { calculateConnectionPoint } from '@/utils/mathHelpers';
import Relationship from '@/models/Relationship.js';

export function useRelationship(relationship) {
    const entities = inject('entities', { value: [] });
    const srcEntity = computed(() => entities.value.find(e => e.id === relationship.src?.id));
    const trgEntity = computed(() => entities.value.find(e => e.id === relationship.trg?.id));

    const srcPoint = computed(() => {
        return calculateConnectionPoint(
            srcEntity.value,
            relationship.src.border,
            relationship.src.position
        );
    });

    const trgPoint = computed(() => {
        return calculateConnectionPoint(
            trgEntity.value,
            relationship.trg.border,
            relationship.trg.position
        );
    });

    const path = computed(() => {
        if (!srcPoint.value || !trgPoint.value) return '';

        if (relationship.bendPoints.length > 0) {
            const points = [
                `${srcPoint.value.x},${srcPoint.value.y}`,
                ...relationship.bendPoints.map(p => `${p.x},${p.y}`),
                `${trgPoint.value.x},${trgPoint.value.y}`
            ];
            return points.join(' ');
        }

        return `${srcPoint.value.x},${srcPoint.value.y} ${trgPoint.value.x},${trgPoint.value.y}`;
    });

    const labelPos = computed(() => {
        return { x: 0, y: 0 }
    });
    const srcMultPos = computed(() => {
        return { x: 0, y: 0 }
    });
    const trgMultPos = computed(() => {
        return { x: 0, y: 0 }
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

    return {
        srcPoint,
        trgPoint,
        path,
        labelPos,
        srcMultPos,
        trgMultPos,
        markerStart,
        markerEnd,
        strokeDasharray,
    };
}
import { computed, inject } from 'vue'
import { calculateOrthogonalPath, getConnectionPoint } from '@/utils/mathHelpers'

export function useRelationship(relationship) {
    const entities = inject('entities', { value: [] })
    const zoom = inject('zoom', { value: 1 })
    const pan = inject('pan', { value: { x: 0, y: 0 } })

    const sourceEntity = computed(() =>
        entities.value.find(e => e.id === relationship.sourceId)
    )
    const targetEntity = computed(() =>
        entities.value.find(e => e.id === relationship.targetId)
    )

    const path = computed(() => {
        if (sourceEntity.value && targetEntity.value) {
            const sourcePoint = getConnectionPoint(sourceEntity.value, targetEntity.value)
            const targetPoint = getConnectionPoint(targetEntity.value, sourceEntity.value)

            const points = calculateOrthogonalPath(sourcePoint, targetPoint)
            return points.map(p => `${p.x},${p.y}`).join(' ')
        }
        return ''
    })

    return { path }
}

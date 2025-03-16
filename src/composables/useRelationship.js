import { ref, computed, inject } from 'vue'

export function useRelationship() {
    const entities = inject('entities')
    const zoom = inject('zoom')
    const pan = inject('pan')
    const canvas = inject('canvas')

    const isCreating = ref(false)
    const creation = ref({
        fromEntityId: null,
        start: { x: 0, y: 0 },
        current: { x: 0, y: 0 },
        finalized: false,
        targetEntityId: null
    })

    /**
     * Starts relationship creation from a given entity.
     * Right-clicking an entity immediately creates a new relationship,
     * with `from` set to the entity id and `to` left as null.
     * @param {MouseEvent} event - The right-click event.
     * @param {Number} entityId - The id of the entity being clicked.
     */
    function startCreation(event, entityId) {
        event.preventDefault()
        // Ensure right-click.
        if (event.button !== 2) return

        const rect = canvas.value.getBoundingClientRect()
        const worldX = (event.clientX - rect.left - pan.value.x) / zoom.value
        const worldY = (event.clientY - rect.top - pan.value.y) / zoom.value

        if (!isCreating.value) {
            isCreating.value = true
            creation.value = {
                fromEntityId: entityId,
                start: { x: worldX, y: worldY },
                current: { x: worldX, y: worldY },
                finalized: false,
                targetEntityId: null
            }
        } else {
            // If already creating, finalize immediately if a different entity is clicked.
            if (entityId !== creation.value.fromEntityId) {
                creation.value.current = { x: worldX, y: worldY }
                creation.value.finalized = true
                creation.value.targetEntityId = entityId
                isCreating.value = false
            } else {
                // If the same entity is clicked again, cancel creation.
                cancelCreation()
            }
        }
    }

    /**
     * Updates the current temporary relationship arrow based on the mouse event.
     * This makes the second end follow the mouse when the relationship is not finalized.
     */
    function updateCreation(event) {
        if (!isCreating.value) return
        const rect = canvas.value.getBoundingClientRect()
        const worldX = (event.clientX - rect.left - pan.value.x) / zoom.value
        const worldY = (event.clientY - rect.top - pan.value.y) / zoom.value
        creation.value.current = { x: worldX, y: worldY }
    }

    /**
     * Cancels the current relationship creation.
     */
    function cancelCreation() {
        isCreating.value = false
        creation.value.finalized = false
        creation.value.targetEntityId = null
    }

    /**
     * Computes the arrow points for a relationship.
     * If a relationship is missing one of its ends (i.e. `to` is null),
     * it uses the current mouse position from the creation object for that end.
     *
     * The arrow is drawn in an L-shape: a horizontal line from the start,
     * then a vertical line to the end.
     *
     * @param {Object} relationship - The relationship model.
     */
    function computeArrowPoints(relationship) {
        // Find the starting entity from the relationship.
        const fromEntity = entities.value.find(e => e.id === relationship.from)
        if (!fromEntity) return ''
        const fromCenter = { x: fromEntity.x + 110, y: fromEntity.y + 20 }

        let toCenter = null
        if (relationship.to) {
            // If the relationship has a target entity, use its center.
            const toEntity = entities.value.find(e => e.id === relationship.to)
            if (!toEntity) return ''
            toCenter = { x: toEntity.x + 110, y: toEntity.y + 20 }
        } else {
            // No target entity assigned; use the current mouse position from creation.
            // Optionally, you can check if the relationship corresponds to the current creation.
            // For now, we'll assume only one temporary relationship is active.
            toCenter = { x: creation.value.current.x, y: creation.value.current.y }
        }

        // Create an L-shaped arrow: horizontal line then vertical line.
        const midPoint = { x: toCenter.x, y: fromCenter.y }
        return `${fromCenter.x},${fromCenter.y} ${midPoint.x},${midPoint.y} ${toCenter.x},${toCenter.y}`
    }

    return {
        isCreating,
        creation,
        startCreation,
        updateCreation,
        cancelCreation,
        relationshipPoints,
        computeArrowPoints
    }
}

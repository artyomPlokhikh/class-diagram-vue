import { ref, computed } from 'vue'

export function useRelationship() {
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
     * @param {MouseEvent} event - The right-click event.
     * @param {Number} entityId - The id of the entity being clicked.
     * @param {Ref} canvas - A ref to the canvas element.
     * @param {Ref} pan - A ref to the pan object.
     * @param {Ref} zoom - A ref to the zoom value.
     */
    function startCreation(event, entityId, canvas, pan, zoom) {
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
     */
    function updateCreation(event, canvas, pan, zoom) {
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
     * Computes the points for a temporary arrow during creation.
     */
    const relationshipPoints = computed(() => {
        if (!isCreating.value && !creation.value.finalized) return ''
        const start = creation.value.start
        const current = creation.value.current
        // Draw an L-shaped arrow: horizontal then vertical.
        const mid = { x: current.x, y: start.y }
        return `${start.x},${start.y} ${mid.x},${mid.y} ${current.x},${current.y}`
    })

    /**
     * Computes arrow points for an existing relationship, given the list of entities.
     * @param {Object} relationship - The relationship model.
     * @param {Array} entities - Array of entities.
     */
    function computeArrowPoints(relationship, entities) {
        const fromEntity = entities.find(e => e.id === relationship.from)
        const toEntity = entities.find(e => e.id === relationship.to)
        if (!fromEntity || !toEntity) return ''
        // Adjust these offsets as needed to compute the entity center.
        const fromCenter = { x: fromEntity.x + 110, y: fromEntity.y + 20 }
        const toCenter = { x: toEntity.x + 110, y: toEntity.y + 20 }
        // Create an L-shaped connection.
        return `${fromCenter.x},${fromCenter.y} ${toCenter.x},${fromCenter.y} ${toCenter.x},${toCenter.y}`
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

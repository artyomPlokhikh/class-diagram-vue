import { ref, computed } from 'vue'

export function useRelationshipCreation(canvas, pan, zoom) {
    const isCreatingRelationship = ref(false)
    const relationshipCreation = ref({
        fromEntityId: null,
        start: { x: 0, y: 0 },
        current: { x: 0, y: 0 },
        finalized: false,
        targetEntityId: null
    })

    /**
     * Called on right‑mousedown on an entity.
     * If no creation is in progress, start one.
     * If one is in progress and the clicked entity is different,
     * finalize immediately.
     */
    const startRelationshipCreation = (event, entityId) => {
        event.preventDefault()
        // Ensure right mouse button.
        if (event.button !== 2) return
        const rect = canvas.value.getBoundingClientRect()
        const worldX = (event.clientX - rect.left - pan.value.x) / zoom.value
        const worldY = (event.clientY - rect.top - pan.value.y) / zoom.value

        if (!isCreatingRelationship.value) {
            // Start new relationship creation.
            isCreatingRelationship.value = true
            relationshipCreation.value = {
                fromEntityId: entityId,
                start: { x: worldX, y: worldY },
                current: { x: worldX, y: worldY },
                finalized: false,
                targetEntityId: null
            }
        } else {
            // Already creating. If clicked on a different entity,
            // finalize immediately.
            if (entityId !== relationshipCreation.value.fromEntityId) {
                relationshipCreation.value.current = { x: worldX, y: worldY }
                relationshipCreation.value.finalized = true
                relationshipCreation.value.targetEntityId = entityId
                // End creation immediately.
                isCreatingRelationship.value = false
            } else {
                // If same entity, cancel creation.
                isCreatingRelationship.value = false
            }
        }
    }

    const updateRelationshipCreation = (event) => {
        if (!isCreatingRelationship.value) return
        const rect = canvas.value.getBoundingClientRect()
        const worldX = (event.clientX - rect.left - pan.value.x) / zoom.value
        const worldY = (event.clientY - rect.top - pan.value.y) / zoom.value
        relationshipCreation.value.current = { x: worldX, y: worldY }
    }

    const cancelRelationshipCreation = () => {
        isCreatingRelationship.value = false
        relationshipCreation.value.finalized = false
        relationshipCreation.value.targetEntityId = null
    }

    const relationshipPoints = computed(() => {
        if (!isCreatingRelationship.value && !relationshipCreation.value.finalized) return ''
        const start = relationshipCreation.value.start
        const current = relationshipCreation.value.current
        const mid = { x: current.x, y: start.y }
        return `${start.x},${start.y} ${mid.x},${mid.y} ${current.x},${current.y}`
    })

    return {
        isCreatingRelationship,
        relationshipCreation,
        startRelationshipCreation,
        updateRelationshipCreation,
        relationshipPoints,
        cancelRelationshipCreation
    }
}

import {ref, onMounted, onUnmounted, isRef, nextTick} from 'vue'

export function useEntity(entity, zoom) {
    const editing = ref(false)
    const entityInput = ref(null)
    const enableEditing = () => {
        editing.value = true
        nextTick(() => {
            if (entityInput.value) {
                entityInput.value.focus()
                entityInput.value.select()
            }
        })
    }
    const disableEditing = () => {
        editing.value = false
    }

    const zoomRef = isRef(zoom) ? zoom : ref(zoom)
    const isDragging = ref(false)
    const startPos = ref({x: 0, y: 0})
    const initialPos = ref({x: entity.x, y: entity.y})

    const startDragging = (event) => {
        isDragging.value = true
        startPos.value = {x: event.clientX, y: event.clientY}
        initialPos.value = {x: entity.x, y: entity.y}
        event.preventDefault()
    }
    const onMouseMove = (event) => {
        if (!isDragging.value) return
        const dx = event.clientX - startPos.value.x
        const dy = event.clientY - startPos.value.y

        entity.x = initialPos.value.x + dx / zoomRef.value
        entity.y = initialPos.value.y + dy / zoomRef.value
    }
    const onMouseUp = () => {
        if (isDragging.value) {
            isDragging.value = false
        }
    }

    onMounted(() => {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    })
    onUnmounted(() => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    })

    return {editing, entityInput, enableEditing, disableEditing, isDragging, startDragging}
}

import {ref, computed} from 'vue'

export function usePanZoom(canvas) {
    const pan = ref({x: 0, y: 0})
    const zoom = ref(1)
    const isCanvasPanning = ref(false)
    const canvasPanStart = ref({x: 0, y: 0})

    const canvasStyle = computed(() => ({
        transform: `translate(${pan.value.x}px, ${pan.value.y}px) scale(${zoom.value})`,
        transformOrigin: '0 0'
    }))

    const handleCanvasMouseDown = (event) => {
        if (event.button === 1) {
            isCanvasPanning.value = true
            canvasPanStart.value = {x: event.clientX, y: event.clientY}
            event.preventDefault()
        }
    }

    const handlePanMouseMove = (event) => {
        if (isCanvasPanning.value) {
            const dx = event.clientX - canvasPanStart.value.x
            const dy = event.clientY - canvasPanStart.value.y
            pan.value.x += dx
            pan.value.y += dy
            canvasPanStart.value = {x: event.clientX, y: event.clientY}
        }
    }

    const handleWheel = (event) => {
        const scaleFactor = 1.1
        const oldZoom = zoom.value
        let newZoom = oldZoom
        if (event.deltaY < 0) {
            newZoom = oldZoom * scaleFactor
        } else {
            newZoom = oldZoom / scaleFactor
        }
        const minZoom = 0.5, maxZoom = 3.0
        newZoom = Math.min(maxZoom, Math.max(minZoom, newZoom))

        const rect = canvas.value.getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top
        pan.value.x = offsetX - ((offsetX - pan.value.x) / oldZoom) * newZoom
        pan.value.y = offsetY - ((offsetY - pan.value.y) / oldZoom) * newZoom
        zoom.value = newZoom
    }

    return {pan, zoom, canvasStyle, handleCanvasMouseDown, handlePanMouseMove, handleWheel, isCanvasPanning}
}

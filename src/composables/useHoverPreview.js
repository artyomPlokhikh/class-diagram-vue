import { ref } from 'vue'
import { calculateBorderPreviewPoint, findClosestPointOnPath } from '@/utils/mathHelpers.js'

export function useHoverPreview() {
    const previewPoint = ref(null)
    const previewType = ref(null)

    function clearPreview() {
        previewPoint.value = null
        previewType.value = null
    }

    function handleRelationshipHover(event, allPoints) {
        const svg = event.target.ownerSVGElement
        const pt = svg.createSVGPoint()
        pt.x = event.clientX;
        pt.y = event.clientY
        const mouse = pt.matrixTransform(svg.getScreenCTM().inverse())

        const { point, distance } = findClosestPointOnPath(allPoints, mouse)
        if (distance < 10) {
            previewPoint.value = point
            previewType.value = 'relationship'
        } else {
            clearPreview()
        }
    }

    function handleEntityBorderHover(event, entityEl, border) {
        const rect = entityEl.getBoundingClientRect()
        previewPoint.value = calculateBorderPreviewPoint(
            rect,
            border,
            { x: event.clientX, y: event.clientY }
        )
        previewType.value = 'entity'
    }


    return {
        previewPoint,
        previewType,
        clearPreview,
        handleRelationshipHover,
        handleEntityBorderHover
    }
}

/**
 * Hover Preview System
 *
 * This composable provides visual feedback when hovering over diagram elements.
 * It handles:
 * - Displaying connection points when hovering over entity borders
 * - Showing potential bend point locations when hovering over relationship lines
 * - Converting between screen and SVG coordinate systems
 * - Managing preview point state for the diagram renderer
 */
import { ref } from 'vue'
import { calculateBorderPreviewPoint, findClosestPointOnPath } from '@/utils/mathHelpers.js'

export function useHoverPreview() {
    const previewPoint = ref(null)
    const previewType = ref(null)

    function clearPreview() {
        previewPoint.value = null
        previewType.value = null
    }

    /**
     * Handles hover events on relationship lines
     * Calculates the closest point on the path to show where a bend point could be added
     *
     * @param {MouseEvent} event - The mouse event
     * @param {Array} allPoints - Array of points defining the relationship path
     */
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

    /**
     * Handles hover events on entity borders
     * Shows where a relationship connection would attach
     *
     * @param {MouseEvent} event - The mouse event
     * @param {HTMLElement} entityEl - The entity element being hovered
     * @param {string} border - Which border is being hovered ('top', 'right', 'bottom', 'left')
     */
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

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { calculateContainerCoordinates, calculateDiagramBounds } from "@/utils/mathHelpers.js";

/**
 * Camera store to manage viewport positioning and zooming for the diagram editor.
 */
export const useCameraStore = defineStore('camera', () => {
    const pan = ref({ x: 0, y: 0 });
    const zoom = ref(1);
    const container = ref(null);
    const cameraInterface = ref(null);

    const setContainer = (el) => {
        container.value = el;
    };

    const setPan = (x, y) => {
        pan.value.x = x;
        pan.value.y = y;
    };

    const setZoom = (z) => {
        zoom.value = z;
    };

    const setCameraInterface = (interfaceObj) => {
        cameraInterface.value = interfaceObj;
    };

    const getViewportCenter = () => {
        const el = container.value;
        if (!el) {
            return { x: 0, y: 0 };
        }
        const rect = el.getBoundingClientRect();
        const screenX = rect.width / 2;
        const screenY = rect.height / 2;

        return {
            x: (screenX - pan.value.x) / zoom.value,
            y: (screenY - pan.value.y) / zoom.value,
        }
    };

    /**
     * Converts DOM event coordinates to container-relative world coordinates
     * @param {Event} event - DOM event with clientX/clientY properties
     * @returns {Object} Coordinates in world space
     */
    const getContainerCoordinates = (event) => {
        return calculateContainerCoordinates(event, container.value, pan.value, zoom.value);
    };

    /**
     * Temporarily zooms to fit objects in view, executes callback, then restores original view
     * Used for operations that need a specific view (e.g., export, screenshots)
     *
     * @param {Array} objects - Diagram objects to fit in view
     * @param {Function} callback - Async function to execute while zoomed
     * @param {Object} options - Configuration options
     * @param {number} [options.padding=20] - Padding around objects in pixels
     * @param {number} [options.safetyMargin=0.1] - Extra margin as percentage of bounds
     * @returns {Promise<void>}
     */
    const fitObjectsTemporarily = async (objects, callback, options = {}) => {
        const originalZoom = zoom.value;
        const originalPan = { x: pan.value.x, y: pan.value.y };

        if (!container.value || !cameraInterface.value) {
            console.error("Camera container or interface not set");
            return;
        }

        const { padding = 20, safetyMargin = 0.1 } = options;

        try {
            const bounds = calculateDiagramBounds(objects);

            const safetyPadding = {
                width: bounds.width * safetyMargin,
                height: bounds.height * safetyMargin
            };

            const adjustedBounds = {
                x: bounds.x - safetyPadding.width / 2,
                y: bounds.y - safetyPadding.height / 2,
                width: bounds.width + safetyPadding.width,
                height: bounds.height + safetyPadding.height
            };

            const containerRect = container.value.getBoundingClientRect();

            const scaleX = containerRect.width / adjustedBounds.width;
            const scaleY = containerRect.height / adjustedBounds.height;
            const newZoom = Math.min(scaleX, scaleY);

            const newPanX = padding - adjustedBounds.x * newZoom;
            const newPanY = padding - adjustedBounds.y * newZoom;

            cameraInterface.value.setZoom(newZoom);
            cameraInterface.value.setPan(newPanX, newPanY);

            await new Promise(resolve => requestAnimationFrame(() => {
                setTimeout(resolve, 100);
            }));

            await callback(adjustedBounds, newZoom);

        } finally {
            if (cameraInterface.value) {
                cameraInterface.value.setZoom(originalZoom);
                cameraInterface.value.setPan(originalPan.x, originalPan.y);
            }
        }
    };

    return {
        pan,
        zoom,
        container,
        setContainer,
        setPan,
        setZoom,
        getViewportCenter,
        getContainerCoordinates,
        setCameraInterface,
        fitObjectsTemporarily,
    };
});

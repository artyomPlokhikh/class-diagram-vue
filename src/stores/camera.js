import { defineStore } from 'pinia';
import { ref } from 'vue';
import { calculateContainerCoordinates } from "@/utils/mathHelpers.js";

export const useCameraStore = defineStore('camera', () => {
    const pan = ref({ x: 0, y: 0 });
    const zoom = ref(1);
    const container = ref(null);

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

    const getContainerCoordinates = (event) => {
        return calculateContainerCoordinates(event, container.value, pan.value, zoom.value);
    }

    return {
        pan,
        zoom,
        container,
        setContainer,
        setPan,
        setZoom,
        getViewportCenter,
        getContainerCoordinates,
    };
});

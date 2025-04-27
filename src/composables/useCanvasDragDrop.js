import Entity from '@/models/Entity.js';
import ANNOTATION from '@/models/Annotation.js';
import { nextTick } from 'vue';
import { getCanvasCoordinates } from "@/utils/mathHelpers.js";


export function useCanvasDragDrop(store, canvasRef, pan, zoom) {
    const typeConfig = {
        empty: { name: 'New Entity', annotation: '' },
        interface: { name: 'New Interface', annotation: ANNOTATION.INTERFACE.name },
        enum: { name: 'New Enum', annotation: ANNOTATION.ENUM.name },
    };

    const onDragOver = (evt) => {
        evt.dataTransfer.dropEffect = 'copy';
        evt.preventDefault();
    };

    const onDrop = (event) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData('application/vnd.uml-diagram-entity');
        if (!raw) return;

        let payload;
        try {
            payload = JSON.parse(raw);
        } catch {
            return;
        }
        const config = typeConfig[payload.type];
        if (!config) return;

        const el = canvasRef.value;
        if (!el) return;

        nextTick(() => {
            const {x, y} = getCanvasCoordinates(event, canvasRef.value, pan.value, zoom.value);

            const newEnt = new Entity({
                ...config,
                x,
                y,
            });
            store.addEntity(newEnt);
        });
    };

    return { onDragOver, onDrop };
};

import Entity from '@/models/Entity.js';
import ANNOTATION from '@/models/Annotation.js';
import { nextTick } from 'vue';
import { useDiagramStore } from "@/stores/diagram.js";
import { useCameraStore } from "@/stores/camera.js";


export function useCanvasDragDrop() {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

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

        const el = cameraStore.container;
        if (!el) return;

        nextTick(() => {
            const { x, y } = cameraStore.getContainerCoordinates(event);

            const newEnt = new Entity({
                ...config,
                x,
                y,
            });
            diagramStore.addEntity(newEnt);
        });
    };

    return { onDragOver, onDrop };
}

import { nextTick } from 'vue';
import { useDiagramStore } from '@/stores/diagram.js';
import { useCameraStore } from '@/stores/camera.js';
import Entity from '@/models/Entity.js';
import Note from '@/models/Note.js';
import ANNOTATION from '@/models/Annotation.js';
import Enumeration from "@/models/Enumeration.js";

export function useCanvasDragDrop() {
    const diagramStore = useDiagramStore();
    const cameraStore = useCameraStore();

    const elementConfig = {
        empty: { name: 'New Entity', annotation: '' },
        interface: { name: 'New Interface', annotation: ANNOTATION.INTERFACE.name },
        note: { content: 'New Note' },
        enumeration: { name: 'New Enumeration', values: ['Value1', 'Value2', 'Value3'] },
    };

    function onDragOver(evt) {
        evt.dataTransfer.dropEffect = 'copy';
        evt.preventDefault();
    }

    function onDrop(evt) {
        evt.preventDefault();

        const raw = evt.dataTransfer.getData('application/vnd.uml-diagram-item');
        if (!raw) return;

        let payload;
        try {
            payload = JSON.parse(raw);
        } catch {
            return;
        }

        nextTick(() => {
            const { x, y } = cameraStore.getContainerCoordinates(evt);

            if (payload.objectType === 'entity') {
                const cfg = elementConfig[payload.key];
                if (!cfg) return;
                const ent = new Entity({ ...cfg, x, y });
                diagramStore.addEntity(ent);

            } else if (payload.objectType === 'note') {
                const note = new Note({ x, y });
                diagramStore.addNote(note);
            } else if (payload.objectType === 'enumeration') {
                const en = new Enumeration({ x, y });
                diagramStore.addEnumeration(en);
            }
        });
    }

    return { onDragOver, onDrop };
}

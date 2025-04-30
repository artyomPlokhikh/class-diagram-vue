<template>
    <div class="palette-panel">
        <div class="palette-panel__header">
            <h3 class="palette-panel__title">Palette</h3>
        </div>

        <div class="palette-panel__list">
            <div
                v-for="item in paletteItems"
                :key="item.objectType + ':' + item.key"
                class="palette-panel__item"
                draggable="true"
                @dragstart="onDragStart($event, item)"
                @click="onClick(item)"
            >
                <div class="palette-panel__block">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import EntityModel from '@/models/Entity.js';
import NoteModel from '@/models/Note.js';
import EnumerationModel from '@/models/Enumeration.js';
import ANNOTATION from '@/models/Annotation.js';
import { useCameraStore } from '@/stores/camera.js';
import { useDiagramStore } from '@/stores/diagram.js';

const cameraStore = useCameraStore();
const diagramStore = useDiagramStore();

const paletteItems = [
    { objectType: 'entity', key: 'empty', name: 'Entity', annotation: '' },
    { objectType: 'entity', key: 'interface', name: 'Interface', annotation: ANNOTATION.INTERFACE.name },
    { objectType: 'note', key: 'note', name: 'Note' },
    { objectType: 'enumeration', 'key': 'enumeration', name: 'Enumeration' },
];

function onDragStart(evt, item) {
    evt.dataTransfer.effectAllowed = 'copy';
    evt.dataTransfer.setData(
        'application/vnd.uml-diagram-item',
        JSON.stringify(item)
    );
    const block = evt.currentTarget;
    const ghost = block.cloneNode(true);
    Object.assign(ghost.style, {
        opacity: '0.5',
        position: 'absolute',
        top: '-1000px'
    });
    document.body.appendChild(ghost);
    const { width, height, left, top } = block.getBoundingClientRect();
    evt.dataTransfer.setDragImage(ghost, width / 2, height / 2);
    setTimeout(() => document.body.removeChild(ghost), 0);
}

function onClick(item) {
    const { objectType, key } = item;
    const { x, y } = cameraStore.getViewportCenter();

    if (objectType === 'entity') {
        const cfg = paletteItems.find(i => i.objectType === 'entity' && i.key === key);
        const ent = new EntityModel({
            name: cfg.name,
            annotation: cfg.annotation,
            x, y
        });
        diagramStore.addEntity(ent);

    } else if (objectType === 'note') {
        const note = new NoteModel({ x, y });
        diagramStore.addNote(note);
    } else if (objectType === 'enumeration') {
        const enumeration = new EnumerationModel({ x, y });
        diagramStore.addEnumeration(enumeration);
    }
}
</script>


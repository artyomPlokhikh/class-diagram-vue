<template>
    <div class="left-panel-content">
        <div class="panel-header">
            <h3>Entities</h3>
        </div>

        <div class="palette">
            <div
                v-for="type in entityTypes"
                :key="type.key"
                class="palette-item"
                draggable="true"
                @dragstart="onDragStart($event, type.key)"
                @click="onClick(type.key)"
            >
                <div class="palette-block">
                    {{ type.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import EntityModel from '@/models/Entity.js';
import ANNOTATION from '@/models/Annotation.js';
import { useCameraStore } from '@/stores/camera.js';
import { useDiagramStore } from "@/stores/diagram.js";

const cameraStore = useCameraStore();
const diagramStore = useDiagramStore();

const rawTypes = [
    { key: 'empty', name: 'Entity', annotation: '' },
    { key: 'interface', name: 'Interface', annotation: ANNOTATION.INTERFACE.name },
    { key: 'enum', name: 'Enum', annotation: ANNOTATION.ENUM.name },
];

const typeConfig = Object.fromEntries(
    rawTypes.map(t => [t.key, { name: t.name, annotation: t.annotation }])
);

const entityTypes = rawTypes;

const onDragStart = (evt, typeKey) => {
    evt.dataTransfer.effectAllowed = 'copy';
    evt.dataTransfer.setData(
        'application/vnd.uml-diagram-entity',
        JSON.stringify({ type: typeKey })
    );
    const block = evt.currentTarget.querySelector('.palette-block');
    const ghost = block.cloneNode(true);
    ghost.style.opacity = '0.5';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    const rect = block.getBoundingClientRect();
    evt.dataTransfer.setDragImage(ghost, rect.width / 2, rect.height / 2);
    setTimeout(() => document.body.removeChild(ghost), 0);
}

const onClick = (typeKey) => {
    const cfg = typeConfig[typeKey];
    if (!cfg) return;

    const {x, y} = cameraStore.getViewportCenter();

    const ent = new EntityModel({ ...cfg, x, y });
    diagramStore.addEntity(ent);
}

</script>

<template>
    <aside class="properties-panel" :class="{ 'properties-panel--closed': !isOpen }">
    <EntityProperties
            v-if="selected instanceof Entity"
            class="properties-panel__content"
        />
        <RelationshipProperties
            v-else-if="selected instanceof Relationship"
            class="properties-panel__content"
        />
        <NoteProperties
            v-else-if="selected instanceof Note"
            class="properties-panel__content"
        />
        <EnumerationProperties
            v-else-if="selected instanceof Enumeration"
            class="properties-panel__content"
        />

        <div v-else class="properties-panel__empty-message">
            Select a canvas object to edit its properties
        </div>

        <div class="properties-panel__resize-handle" @mousedown="startResize"></div>
        <button class="properties-panel__toggle" @click="isOpen = !isOpen">
            {{ isOpen ? '▶' : '◀' }}
        </button>
    </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDiagramStore } from '@/stores/diagram';

import EntityProperties from '@/components/properties-panel/EntityProperties.vue';
import RelationshipProperties from '@/components/properties-panel/RelationshipProperties.vue';
import NoteProperties from "@/components/properties-panel/NoteProperties.vue";
import EnumerationProperties from "@/components/properties-panel/EnumerationProperties.vue";

import Entity from "@/models/Entity.js";
import Relationship from "@/models/Relationship.js";
import Note from "@/models/Note.js";
import Enumeration from "@/models/Enumeration.js";

const isOpen = ref(true);
const startResize = (e) => {
    e.preventDefault();

    const panelEl = e.target.parentElement;
    const startX = e.clientX;
    const startWidth = panelEl.offsetWidth;

    const onMouseMove = (e) => {
        const delta = startX - e.clientX;
        const newWidth = startWidth + delta;
        if (newWidth >= 200 && newWidth <= 500) {
            panelEl.style.width = `${newWidth}px`;
        }
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

const store = useDiagramStore();
const selected = computed(() => store.selected);

</script>
<template>
    <aside class="properties-panel">
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
    </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';

import EntityProperties from '@/components/properties-panel/EntityProperties.vue';
import RelationshipProperties from '@/components/properties-panel/RelationshipProperties.vue';
import NoteProperties from "@/components/properties-panel/NoteProperties.vue";
import EnumerationProperties from "@/components/properties-panel/EnumerationProperties.vue";

import Entity from "@/models/Entity.js";
import Relationship from "@/models/Relationship.js";
import Note from "@/models/Note.js";
import Enumeration from "@/models/Enumeration.js";

const store = useDiagramStore();
const selected = computed(() => store.selected);

</script>
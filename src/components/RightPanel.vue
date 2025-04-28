<template>
    <div class="right-panel-content">
        <EntityProperties v-if="selected instanceof Entity"/>
        <RelationshipProperties v-else-if="selected instanceof Relationship"/>
        <NoteProperties v-else-if="selected instanceof Note"/>
        <EnumerationProperties v-else-if="selected instanceof Enumeration"/>

        <div v-else class="empty-properties">
            Select a canvas object to edit its properties
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';

import EntityProperties from '@/components/editor/EntityProperties.vue';
import RelationshipProperties from '@/components/editor/RelationshipProperties.vue';
import NoteProperties from "@/components/editor/NoteProperties.vue";
import EnumerationProperties from "@/components/editor/EnumerationProperties.vue";

import Entity from "@/models/Entity.js";
import Relationship from "@/models/Relationship.js";
import Note from "@/models/Note.js";
import Enumeration from "@/models/Enumeration.js";

const store = useDiagramStore();
const selected = computed(() => store.selected);

</script>
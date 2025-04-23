<template>
    <div class="right-panel-content">
        <EntityProperties v-if="selected instanceof Entity"/>
        <RelationshipProperties v-else-if="selected instanceof Relationship"/>
        <div v-else class="empty-properties">
            Select an entity or relationship to edit properties
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import EntityProperties from '@/components/editor/EntityProperties.vue';
import RelationshipProperties from '@/components/editor/RelationshipProperties.vue';
import Entity from "@/models/Entity.js";
import Relationship from "@/models/Relationship.js";

const store = useDiagramStore();
const selected = computed(() => store.selected);

</script>
<template>
    <div class="right-panel-content">
        <EntityEditor v-if="selected instanceof Entity"/>
        <RelationshipEditor v-else-if="selected instanceof Relationship"/>
        <div v-else class="empty-properties">
            Select an entity or relationship to edit properties
        </div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {useDiagramStore} from '@/stores/diagram'
import EntityEditor from '@/components/editor/EntityEditor.vue'
import RelationshipEditor from '@/components/editor/RelationshipEditor.vue'
import Entity from "@/models/Entity.js";
import Relationship from "@/models/Relationship.js";

const store = useDiagramStore()
const selected = computed(() => store.selected)

</script>
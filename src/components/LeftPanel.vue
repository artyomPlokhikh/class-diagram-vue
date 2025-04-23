<template>
    <div class="left-panel-content">
        <div class="panel-header">
            <h3>Entities</h3>
            <button @click="store.addEntity" class="add-button">
                + Add Entity
            </button>
        </div>

        <div v-if="entities.length" class="entities-list">
            <div v-for="entity in entities"
                 :key="entity.id"
                 class="entity-item"
                 @click="store.setSelected(entity)"
                 :class="{ selected: selectedEntity?.id === entity.id }">
                {{ entity.name }}
            </div>
        </div>

        <div v-else class="empty-state">
            No entities created yet
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '../stores/diagram';

const store = useDiagramStore();
const entities = computed(() => store.entities.filter(e => e?.id && e?.name));
const selectedEntity = computed(() => store.selected);

</script>

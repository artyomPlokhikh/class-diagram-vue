<template>
    <div class="left-panel-content">
        <div class="panel-header">
            <h3>Entities</h3>
            <button @click="addEntity" class="add-button">
                + Add Entity
            </button>
        </div>

        <div v-if="entities.length" class="entities-list">
            <div v-for="entity in entities"
                 :key="entity.id"
                 class="entity-item"
                 @click="selectEntity(entity)"
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
import { computed } from 'vue'
import { useDiagramStore } from '../stores/diagram'

const store = useDiagramStore()
const entities = computed(() =>
    store.entities.filter(e => e?.id && e?.name)
)
const selectedEntity = computed(() => store.selectedEntity)

const addEntity = () => {
    store.addEntity({
        name: 'New Entity',
        x: 100,
        y: 100,
        attributes: []
    })
}

const selectEntity = (entity) => {
    store.setSelectedEntity(entity)
}
</script>

<style scoped>
.left-panel-content {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.panel-header h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.add-button {
    padding: 6px 12px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.add-button:hover {
    background: #1e88e5;
}

.entities-list {
    flex: 1;
    overflow-y: auto;
    margin-right: -16px;
    padding-right: 16px;
}

.entity-item {
    padding: 8px 12px;
    margin: 4px 0;
    background: #f8f9fa;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: all 0.2s ease;
}

.entity-item:hover {
    background: #e9ecef;
}

.entity-item.selected {
    background: #e3f2fd;
    font-weight: 500;
}

.empty-state {
    padding: 16px;
    color: #666;
    text-align: center;
    font-size: 14px;
}
</style>
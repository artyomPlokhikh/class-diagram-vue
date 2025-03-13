<template>
    <div
        class="entity"
        :class="{ selected }"
        :style="positionStyle"
        @mousedown="startDrag"
        @click.stop="handleClick"
    >
        <div class="entity-header">
            <input
                v-model="entity.name"
                class="entity-name"
                @click.stop
            />
            <button
                class="delete-btn"
                @click.stop="deleteEntity"
            >
                ×
            </button>
        </div>

        <ul class="attributes-list">
            <li
                v-for="(attr, index) in entity.attributes"
                :key="index"
                class="attribute-item"
            >
                <span class="attribute-name">{{ attr.name }}</span>
                <span class="attribute-type">{{ attr.type }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {useDiagramStore} from '../stores/diagram'

const props = defineProps({
    entity: Object,
    selected: Boolean,
    dragging: Boolean
})

const emit = defineEmits(['drag-start'])

const store = useDiagramStore()

const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: store.draggingEntity?.id === props.entity.id
        ? 'none'
        : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}))

const startDrag = (event) => {
    emit('drag-start', {
        entityId: props.entity.id,
        startX: event.clientX,
        startY: event.clientY
    })
}

const handleClick = () => {
    store.setSelectedEntity(props.entity)
}

const deleteEntity = () => {
    if (confirm(`Delete entity "${props.entity.name}"?`)) {
        store.deleteEntity(props.entity.id)
    }
}
</script>

<style scoped>
.entity {
    position: absolute;
    background: #ffffff;
    border: 2px solid #2196f3;
    border-radius: 8px;
    padding: 12px;
    min-width: 220px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: grab;
    user-select: none;
    transition: transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
}

.entity.selected {
    border-color: #ff4081;
    box-shadow: 0 4px 16px rgba(255, 64, 129, 0.2);
    z-index: 10;
}

.entity:active {
    cursor: grabbing;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.entity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.entity-name {
    font-weight: 600;
    border: none;
    background: transparent;
    font-size: 16px;
    width: 80%;
}

.delete-btn {
    border: none;
    background: none;
    color: #ff1744;
    font-size: 20px;
    cursor: pointer;
    padding: 0 6px;
}

.delete-btn:hover {
    background: #ffebee;
}

.attributes-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.attribute-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    border-bottom: 1px solid #eee;
}

.attribute-name {
    color: #333;
}

.attribute-type {
    color: #666;
    font-size: 0.9em;
}

</style>
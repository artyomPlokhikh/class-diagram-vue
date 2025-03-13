<template>
    <div class="canvas"
         @mousemove="handleDrag"
         @mouseup="stopDrag"
         @mouseleave="stopDrag"
         ref="canvas"
    >

        <!-- Entities -->
        <Entity
            v-for="entity in entities"
            :key="entity.id"
            :entity="entity"
            :selected="selectedEntity?.id === entity.id"
            :dragging="draggingEntity?.id === entity.id"
            @drag-start="startDrag"
        />

    </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useDiagramStore} from '@/stores/diagram'
import Entity from '@/components/Entity.vue'

const store = useDiagramStore()
const canvas = ref(null)

const entities = computed(() => store.entities)
const selectedEntity = computed(() => store.selectedEntity)
const draggingEntity = computed(() => store.draggingEntity)

const startDrag = ({entityId, startX, startY}) => {
    store.startDrag(entityId, startX, startY)
}

const handleDrag = (event) => {
    if (store.draggingEntity) {
        store.updateDragPosition(event.clientX, event.clientY)
    }
}

const stopDrag = () => {
    store.stopDrag()
}
</script>

<style scoped>
.canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #fafafa;
}
</style>
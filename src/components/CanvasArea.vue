<template>
    <div class="canvas"
         @mousedown="handleCanvasMouseDown"
         @click="handleCanvasClick"
         @wheel.prevent="handleWheel"
         @contextmenu.prevent
         ref="canvas"
    >
        <div class="canvas-inner" :style="canvasStyle">
            <!-- Entities container -->
            <div class="entities">
                <Entity v-for="entity in entities"
                        :key="entity.id"
                        :entity="entity"
                        :zoom="zoom"
                        @entity-select="store.setSelected(entity)"
                        @entity-delete="store.deleteEntity(entity.id)"
                        @click.right="startCreation($event, entity.id)"
                        :data-entity-id="entity.id"
                />
            </div>
            <!-- SVG overlay for relationships -->
            <svg class="relationship-svg">
                <Relationship v-for="rel in relationships"
                              :key="rel.id"
                              :relationship="rel"
                />
                <polyline v-if="isCreatingRelationship"
                          :points="relationshipPoints"
                          stroke="red" fill="none" stroke-width="2"
                          marker-end="url(#arrowhead)"
                />
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7"
                            refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
                    </marker>
                </defs>
            </svg>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useDiagramStore} from '@/stores/diagram'
import Entity from '@/components/Entity.vue'
import Relationship from '@/components/Relationship.vue'
import RelationshipModel from '@/models/Relationship'
import {usePanZoom} from '@/composables/usePanZoom'
import {useRelationship} from "@/composables/useRelationship.js";

const store = useDiagramStore()
const canvas = ref(null)

const {
    pan,
    zoom,
    canvasStyle,
    handleCanvasMouseDown,
    handlePanMouseMove,
    handleWheel,
    isCanvasPanning
} = usePanZoom(canvas)

const {
    isCreatingRelationship,
    relationshipCreation,
    startCreation,
    updateRelationshipCreation,
    relationshipPoints,
    cancelRelationshipCreation
} = useRelationship(canvas, pan, zoom)

const entities = computed(() => store.entities)
const relationships = computed(() => store.relationships)

const handleCanvasClick = (event) => {
    if (event.target === canvas.value || event.target.classList.contains('canvas-inner')) {
        store.setSelected(null)
    }
}

const handleMouseMove = (event) => {
    if (isCreatingRelationship.value) {
        updateRelationshipCreation(event)
    } else {
        handlePanMouseMove(event)
    }
}

const getEntityIdFromEvent = (event) => {
    const path = event.composedPath ? event.composedPath() : event.path
    for (const el of path) {
        if (el.dataset && el.dataset.entityId) {
            return el.dataset.entityId
        }
    }
    return null
}

const handleMouseUp = (event) => {
    if (isCreatingRelationship.value) {
        const targetEntityId = getEntityIdFromEvent(event)
        if (targetEntityId && targetEntityId !== relationshipCreation.value.fromEntityId.toString()) {
            const newRel = new RelationshipModel(
                null,
                relationshipCreation.value.fromEntityId,
                Number(targetEntityId),
                '1:M'
            )
            store.addRelationship(newRel)
        }
        cancelRelationshipCreation()
    }
    if (isCanvasPanning.value) {
        isCanvasPanning.value = false
    }
}

onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
})
</script>
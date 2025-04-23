<template>
    <div class="canvas"
         @mousedown.middle="handleCanvasMouseDown"
         @click="handleCanvasClick"
         @wheel.prevent="handleWheel"
         @contextmenu.prevent
         ref="canvas"
    >
        <div class="canvas-inner" :style="canvasStyle">
            <!-- Entities container -->
            <div class="entities">
                <Entity
                    v-for="entity in entities"
                    :key="entity.id"
                    :entity="entity"
                    @entity-select="store.setSelected(entity)"
                    @relationship-connect="store.connectRelationship(entity.id)"
                />
            </div>
            <!-- SVG overlay for relationships -->
            <svg class="relationship-svg">
                <RelationshipMarkers/>

                <Relationship
                    v-for="relationship in relationships"
                    :key="relationship.id"
                    :relationship="relationship"
                    @relationship-select="store.setSelected(relationship)"
                    @relationship-delete="store.deleteRelationship(relationship.id)"
                />
            </svg>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import { useCamera } from '@/composables/useCamera.js';
import Entity from '@/components/Entity.vue';
import Relationship from '@/components/Relationship.vue';
import RelationshipMarkers from '@/components/markers/RelationshipMarkers.vue';

const store = useDiagramStore();

const canvas = ref(null);
provide('canvas', canvas);

const {
    pan,
    zoom,
    canvasStyle,
    handleCanvasMouseDown,
    handleWheel,
} = useCamera(canvas);
provide('pan', pan);
provide('zoom', zoom);

const entities = computed(() => store.entities);
provide('entities', entities);
const relationships = computed(() =>
    store.relationships.filter(rel => rel?.source?.id && rel?.target?.id)
);

const handleCanvasClick = () => {
    store.setSelected(null);
};
</script>
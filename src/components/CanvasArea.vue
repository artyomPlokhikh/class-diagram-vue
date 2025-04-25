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
                    @entity-select="diagramStore.setSelected(entity)"
                    @relationship-connect="relationshipCreator.handleRelationshipConnect"
                />
            </div>
            <!-- SVG overlay for relationships -->
            <svg class="relationship-svg">
                <RelationshipMarkers/>

                <Relationship
                    v-for="relationship in relationships"
                    :key="relationship.id"
                    :relationship="relationship"
                    @relationship-select="diagramStore.setSelected(relationship)"
                    @relationship-drag="(payload) => relationshipCreator.handleRelationshipDrag(payload.relationship, payload.handleType)"
                    @bend-drag="bendDragger.startBendDrag"
                />

                <line
                    v-if="relationshipCreator.pendingRelationship"
                    :x1="relationshipCreator.startPoint.value.x"
                    :y1="relationshipCreator.startPoint.value.y"
                    :x2="relationshipCreator.endPoint.value.x"
                    :y2="relationshipCreator.endPoint.value.y"
                    stroke="rgba(0, 0, 0, 0.5)"
                    stroke-width="2"
                    stroke-dasharray="5,5"
                />
            </svg>

            <svg id="handles-svg" class="handles-svg"></svg>
            <svg class="preview-overlay">
                <circle
                    v-if="previewPoint"
                    :cx="previewPoint.x"
                    :cy="previewPoint.y"
                    r="5"
                    fill="rgba(0,255,0,0.3)"
                    stroke="green"
                />
            </svg>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import { useCamera } from '@/composables/useCamera.js';
import { useRelationshipCreator } from '@/composables/useRelationshipCreator.js';
import { useBendDragger } from '@/composables/useBendDragger';
import Entity from '@/components/Entity.vue';
import Relationship from '@/components/Relationship.vue';
import RelationshipMarkers from '@/components/markers/RelationshipMarkers.vue';
import { useHoverPreview } from "@/composables/useHoverPreview.js";

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

const diagramStore = useDiagramStore();
provide('selectedObj', computed(() => diagramStore.selected));

const relationshipCreator = useRelationshipCreator(diagramStore, canvas, pan, zoom);
const bendDragger = useBendDragger(diagramStore, canvas, pan, zoom);

const entities = computed(() => diagramStore.entities);
provide('entities', entities);

const relationships = computed(() =>
    diagramStore.relationships.filter(rel => rel?.src?.id && rel?.trg?.id)
);

const handleCanvasClick = () => {
    diagramStore.setSelected(null);
};

const { previewPoint } = useHoverPreview()

</script>
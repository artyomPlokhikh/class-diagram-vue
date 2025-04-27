<template>
    <div class="canvas-area"
         @mousedown.middle="handleCanvasMouseDown"
         @click="diagramStore.setSelected(null)"
         @wheel.prevent="handleWheel"
         @contextmenu.prevent
         ref="canvas"
    >
        <div class="canvas-inner" :style="canvasStyle">
            <!-- Entities container -->
            <div class="entities">
                <Entity
                    v-for="entity in diagramStore.entities"
                    :key="entity.id"
                    :entity="entity"
                    :isSelected="diagramStore.selected === entity"
                    @entity-select="diagramStore.setSelected(entity)"
                    @relationship-connect="relationshipCreator.handleRelationshipConnect"
                />
            </div>
            <!-- SVG overlay for relationships -->
            <svg class="relationship-svg">
                <RelationshipMarkers/>

                <Relationship
                    v-for="relationship in diagramStore.relationships"
                    :key="relationship.id"
                    :relationship="relationship"
                    :isSelected="diagramStore.selected === relationship"
                    @relationship-select="diagramStore.setSelected(relationship)"
                    @relationship-drag="relationshipCreator.handleRelationshipDrag"
                    @bend-drag="bendDragger.startBendDrag"
                />

                <polyline
                    v-if="relationshipCreator.pendingRelationship"
                    :points="relationshipCreator.previewPath.value"
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.5)"
                    stroke-width="2"
                    stroke-dasharray="5,5"
                />
            </svg>

            <!-- Previews -->
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

            <!-- overlay the guides -->
            <SnapGuides/>
        </div>
    </div>
</template>

<script setup>
import { ref, provide, inject } from 'vue';
import { useCamera } from '@/composables/useCamera.js';
import { useRelationshipCreator } from '@/composables/useRelationshipCreator.js';
import { useBendDragger } from '@/composables/useBendDragger';
import Entity from '@/components/Entity.vue';
import Relationship from '@/components/Relationship.vue';
import RelationshipMarkers from '@/components/markers/RelationshipMarkers.vue';
import SnapGuides from '@/components/SnapGuides.vue'
import { useHoverPreview } from "@/composables/useHoverPreview.js";


// Canvas and camera setup
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


// Data store
const diagramStore = inject('diagramStore');


// Composables
const relationshipCreator = useRelationshipCreator(diagramStore, canvas, pan, zoom);
const bendDragger = useBendDragger(diagramStore, canvas, pan, zoom);
const { previewPoint } = useHoverPreview();

</script>
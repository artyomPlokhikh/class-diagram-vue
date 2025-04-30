<template>
    <div class="diagram-canvas">
        <div class="diagram-canvas__container"
             @mousedown.middle="handleCanvasMouseDown"
             @click="diagramStore.setSelected(null)"
             @wheel.prevent="handleWheel"
             @contextmenu.prevent
             ref="canvas"
             @dragover.prevent="onDragOver"
             @drop="onDrop"
        >
            <div class="diagram-canvas__viewport" :style="canvasStyle">
                <svg class="diagram-canvas__relationships-svg">
                    <RelationshipMarkers />

                    <DiagramRelationship
                        v-for="rel in diagramStore.relationships"
                        :key="rel.id"
                        :relationship="rel"
                        :isSelected="diagramStore.selected === rel"
                        @relationship-select="diagramStore.setSelected(rel)"
                        @relationship-drag="relationshipCreator.handleRelationshipDrag"
                        @bend-drag="bendDragger.startBendDrag"
                    />

                    <polyline
                        v-if="relationshipCreator.pendingRelationship"
                        :points="relationshipCreator.previewPath.value"
                        class="diagram-canvas__preview-line"
                    />
                </svg>

                <svg id="relationship-handles-svg" class="diagram-canvas__handles-svg"></svg>

                <svg class="diagram-canvas__preview-svg">
                    <circle
                        v-if="hover.previewPoint.value"
                        :cx="hover.previewPoint.value.x"
                        :cy="hover.previewPoint.value.y"
                        r="5"
                        class="diagram-canvas__preview-dot"
                    />
                </svg>

                <SnapGuides class="diagram-canvas__guides"/>

                <div class="diagram-canvas__layer diagram-canvas__layer--notes">
                    <DiagramNote
                        v-for="note in diagramStore.notes"
                        :key="note.id"
                        :note="note"
                        :isSelected="diagramStore.selected === note"
                        @note-select="diagramStore.setSelected(note)"
                        @relationship-connect="relationshipCreator.handleRelationshipConnect"
                    />
                </div>

                <div class="diagram-canvas__layer diagram-canvas__layer--enumerations">
                    <DiagramEnumeration
                        v-for="enumeration in diagramStore.enumerations"
                        :key="enumeration.id"
                        :enumeration="enumeration"
                        :isSelected="diagramStore.selected === enumeration"
                        @enumeration-select="diagramStore.setSelected(enumeration)"
                        @relationship-connect="relationshipCreator.handleRelationshipConnect"
                    />
                </div>

                <div class="diagram-canvas__layer diagram-canvas__layer--entities">
                    <DiagramEntity
                        v-for="entity in diagramStore.entities"
                        :key="entity.id"
                        :entity="entity"
                        :isSelected="diagramStore.selected === entity"
                        @entity-select="diagramStore.setSelected(entity)"
                        @relationship-connect="relationshipCreator.handleRelationshipConnect"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, provide } from 'vue';

import DiagramEnumeration from "@/components/diagram/DiagramEnumeration.vue";
import DiagramNote from "@/components/diagram/DiagramNote.vue";
import DiagramEntity from '@/components/diagram/DiagramEntity.vue';
import DiagramRelationship from '@/components/diagram/DiagramRelationship.vue';
import SnapGuides from '@/components/diagram/SnapGuides.vue'

import RelationshipMarkers from '@/components/markers/RelationshipMarkers.vue';

import { useCamera } from '@/composables/useCamera.js';
import { useRelationshipCreator } from '@/composables/useRelationshipCreator.js';
import { useBendDragger } from '@/composables/useBendDragger';
import { useHoverPreview } from "@/composables/useHoverPreview.js";
import { useCanvasDragDrop } from "@/composables/useCanvasDragDrop.js";
import { useDiagramStore } from "@/stores/diagram.js";


// Canvas and camera setup
const canvas = ref(null);
provide('canvas', canvas);
const { canvasStyle, handleCanvasMouseDown, handleWheel } = useCamera(canvas);

// Data store
const diagramStore = useDiagramStore();


// Composables
const relationshipCreator = useRelationshipCreator();
const bendDragger = useBendDragger();
const hover = useHoverPreview();
provide('hover', hover);
const { onDragOver, onDrop } = useCanvasDragDrop();
</script>

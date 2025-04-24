<template>
    <g @click.stop="emit('relationship-select')" class="relationship">
        <polyline
            :points="path"
            stroke="transparent"
            fill="none"
            stroke-width="25"
            @dblclick="addBendPoint"
            @mousemove="handleRelationshipHover($event, allPoints)"
            @mouseleave="clearPreview"
        />
        <polyline
            :points="path"
            stroke="black"
            fill="none"
            stroke-width="2"
            :stroke-dasharray="strokeDasharray"
            :marker-start="markerStart"
            :marker-end="markerEnd"
            @dblclick="addBendPoint"
            @mousemove="handleRelationshipHover($event, allPoints)"
            @mouseleave="clearPreview"
        />

        <text
            :x="labelPos.x"
            :y="labelPos.y - 5"
            text-anchor="middle"
            class="relationship-label"
        >
            {{ relationship.name }}
        </text>
        <text
            :x="srcMultPos.x"
            :y="srcMultPos.y"
            text-anchor="middle"
            class="multiplicity-label"
        >
            {{ relationship.src?.mult }}
        </text>
        <text
            :x="trgMultPos.x"
            :y="trgMultPos.y"
            text-anchor="middle"
            class="multiplicity-label"
        >
            {{ relationship.trg?.mult }}
        </text>
    </g>

    <teleport to="#handles-svg">
        <g v-show="isSelected">
            <template v-for="(pt, idx) in relationship.bendPoints" :key="idx">
                <circle
                    class="interaction-handle"
                    :cx="pt.x" :cy="pt.y" r="10"
                    fill="transparent"
                    @mousedown.stop.prevent="emit('bend-drag', { relationship, idx })"
                />
                <circle
                    class="bend-handle"
                    :cx="pt.x" :cy="pt.y" r="5"
                    @contextmenu.prevent="removeBendPoint(idx)"
                    @mousedown.stop.prevent="emit('bend-drag', { relationship, idx })"
                />
            </template>

            <circle
                class="interaction-handle"
                :cx="srcPoint.x" :cy="srcPoint.y" r="12"
                fill="transparent"
                @mousedown.stop.prevent="emit('relationship-drag', { relationship, handleType:'src' })"
            />
            <circle
                class="relationship-handle"
                :cx="srcPoint.x" :cy="srcPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag', { relationship, handleType:'src' })"
            />

            <circle
                class="interaction-handle"
                :cx="trgPoint.x" :cy="trgPoint.y" r="12"
                fill="transparent"
                @mousedown.stop.prevent="emit('relationship-drag', { relationship, handleType:'trg' })"
            />
            <circle
                class="relationship-handle"
                :cx="trgPoint.x" :cy="trgPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag', { relationship, handleType:'trg' })"
            />
        </g>
    </teleport>
</template>

<script setup>
import { useRelationship } from '@/composables/useRelationship';
import { useHoverPreview } from '@/composables/useHoverPreview.js';
import Relationship from '@/models/Relationship.js';
import { computed, inject } from "vue";

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    }
});
const emit = defineEmits(['relationship-select', 'relationship-drag', 'bend-drag']);

const selectedObj = inject("selectedObj", {value: null});
const isSelected = computed(() => selectedObj.value?.id === props.relationship.id);

const {
    path,
    srcPoint,
    trgPoint,
    allPoints,
    labelPos,
    srcMultPos,
    trgMultPos,
    markerStart,
    markerEnd,
    strokeDasharray,
    addBendPoint,
    removeBendPoint,
} = useRelationship(props.relationship);

const { handleRelationshipHover, clearPreview } = useHoverPreview();

</script>

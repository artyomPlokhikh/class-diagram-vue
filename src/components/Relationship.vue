<template>
    <g
        class="relationship"
        @click.stop="emit('relationship-select')"
    >
        <polyline
            class="hit-area"
            :points="path"
            stroke="transparent"
            fill="none"
            stroke-width="25"
            @contextmenu.prevent="addBendPoint"
            @mousemove="handleRelationshipHover($event, allPoints)"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false; clearPreview()"
        />
        <polyline
            class="main-line"
            :points="path"
            stroke="black"
            fill="none"
            stroke-width="2"
            :stroke-dasharray="strokeDasharray"
            :marker-start="markerStart"
            :marker-end="markerEnd"
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
        <g
            v-show="isSelected || isHovering"
            class="handles"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
        >
            <template v-for="(pt, idx) in relationship.bendPoints" :key="idx">
                <circle
                    class="interaction-handle"
                    :cx="pt.x" :cy="pt.y" r="10"
                />
                <circle
                    class="bend-handle"
                    :cx="pt.x" :cy="pt.y" r="5"
                    @contextmenu.prevent="removeBendPoint(idx)"
                    @mousedown.stop.prevent="e => emit('bend-drag', relationship, idx, e)"
                />
            </template>

            <circle
                class="interaction-handle"
                :cx="srcPoint.x" :cy="srcPoint.y" r="12"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'src' })"
            />
            <circle
                class="relationship-handle"
                :cx="srcPoint.x" :cy="srcPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'src' })"
            />

            <circle
                class="interaction-handle"
                :cx="trgPoint.x" :cy="trgPoint.y" r="12"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'trg' })"
            />
            <circle
                class="relationship-handle"
                :cx="trgPoint.x" :cy="trgPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'trg' })"
            />
        </g>
    </teleport>
</template>

<script setup>
import { useRelationship } from '@/composables/useRelationship';
import { useHoverPreview } from '@/composables/useHoverPreview.js';
import Relationship from '@/models/Relationship.js';
import { ref } from "vue";

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['relationship-select', 'relationship-drag', 'bend-drag']);

const isHovering = ref(false);

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

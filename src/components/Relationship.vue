<template>
    <g @click.stop="emit('relationship-select')" class="relationship">
        <polyline
            :points="path"
            stroke="transparent"
            fill="none"
            stroke-width="25"
        />
        <polyline
            :points="path"
            stroke="black"
            fill="none"
            stroke-width="2"
            :stroke-dasharray="strokeDasharray"
            :marker-start="markerStart"
            :marker-end="markerEnd"
        />
        <circle
            class="relationship-handle"
            :cx="srcPoint.x"
            :cy="srcPoint.y"
            r="5"
            fill="blue"
            cursor="pointer"
        />
        <circle
            class="relationship-handle"
            :cx="trgPoint.x"
            :cy="trgPoint.y"
            r="5"
            fill="red"
            cursor="pointer"
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
</template>

<script setup>
import { useRelationship } from '@/composables/useRelationship'
import Relationship from '@/models/Relationship.js'

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    }
})
const emit = defineEmits(['relationship-select'])
const {
    path,
    srcPoint,
    trgPoint,
    labelPos,
    srcMultPos,
    trgMultPos,
    markerStart,
    markerEnd,
    strokeDasharray,
} = useRelationship(props.relationship)
</script>

<style scoped>
.relationship-label {
    font-size: 12px;
    pointer-events: none;
}

.multiplicity-label {
    font-size: 10px;
    pointer-events: none;
}

.relationship-handle {
    stroke: black;
    stroke-width: 2;
}
</style>

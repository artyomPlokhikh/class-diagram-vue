<template>
    <g @click.stop="emit('relationship-select')" class="relationship">
        <polyline
            :points="path"
            stroke="transparent"
            fill="none"
            stroke-width="25"
            @dblclick="addManualPoint"
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
            :cx="sourcePoint.x"
            :cy="sourcePoint.y"
            r="5"
            fill="blue"
            cursor="pointer"
        />
        <circle
            class="relationship-handle"
            :cx="targetPoint.x"
            :cy="targetPoint.y"
            r="5"
            fill="red"
            cursor="pointer"
        />
        <text
            :x="labelPoint.x"
            :y="labelPoint.y - 5"
            text-anchor="middle"
            class="relationship-label"
        >
            {{ relationship.name }}
        </text>
        <text
            :x="sourceMultiplicityPoint.x"
            :y="sourceMultiplicityPoint.y"
            text-anchor="middle"
            class="multiplicity-label"
        >
            {{ relationship.source?.multiplicity }}
        </text>
        <text
            :x="targetMultiplicityPoint.x"
            :y="targetMultiplicityPoint.y"
            text-anchor="middle"
            class="multiplicity-label"
        >
            {{ relationship.target?.multiplicity }}
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
    sourcePoint,
    targetPoint,
    markerStart,
    markerEnd,
    strokeDasharray,
    labelPoint,
    sourceMultiplicityPoint,
    targetMultiplicityPoint,
    addManualPoint
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

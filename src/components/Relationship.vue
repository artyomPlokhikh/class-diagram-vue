<template>
    <g @click.stop="emit('relationship-select')" class="relationship">
        <!-- Invisible polyline for increased click area -->
        <polyline
            :points="composable.path.value"
            stroke="transparent"
            fill="none"
            stroke-width="25"
        />
        <!-- Visible relationship drawing -->
        <polyline
            :points="composable.path.value"
            stroke="black"
            fill="none"
            stroke-width="2"
            :stroke-dasharray="composable.strokeDasharray.value"
            :marker-start="composable.markerStart.value"
            :marker-end="composable.markerEnd.value"
        />
        <!-- Source handle -->
        <circle
            class="relationship-handle"
            :cx="composable.sourcePoint.value.x"
            :cy="composable.sourcePoint.value.y"
            r="5"
            fill="blue"
            cursor="pointer"
            @mousedown=""
        />
        <!-- Target handle -->
        <circle
            class="relationship-handle"
            :cx="composable.targetPoint.value.x"
            :cy="composable.targetPoint.value.y"
            r="5"
            fill="red"
            cursor="pointer"
            @mousedown=""
        />
        <!-- Relationship name -->
        <text
            :x="composable.labelPoint.value?.x"
            :y="composable.labelPoint.value?.y - 5"
            text-anchor="middle"
            class="relationship-label"
        > {{ relationship.name }}
        </text>

        <!-- Multiplicities -->
        <text
            :x="composable.sourceMultiplicityPoint.value.x"
            :y="composable.sourceMultiplicityPoint.value.y"
            text-anchor="middle"
            class="multiplicity-label"
        >{{ relationship.source?.multiplicity }}
        </text>
        <text
            :x="composable.targetMultiplicityPoint.value.x"
            :y="composable.targetMultiplicityPoint.value.y"
            text-anchor="middle"
            class="multiplicity-label"
        >{{ relationship.target?.multiplicity }}
        </text>
    </g>
</template>

<script setup>
import { useRelationship } from '@/composables/useRelationship';
import Relationship from "@/models/Relationship.js";

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    },
});
const emit = defineEmits(['relationship-select']);
const composable = useRelationship(props.relationship);
</script>

<style scoped>
.relationship-label {
    font-size: 12px;
    pointer-events: none;
    background: white;
}

.multiplicity-label {
    font-size: 10px;
    pointer-events: none;
}

.relationship-handle {
    stroke: black;
    stroke-width: 2;
    z-index: -1;
}
</style>

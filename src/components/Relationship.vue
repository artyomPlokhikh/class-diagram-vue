<template>
    <g @click.stop="emit('relationship-select')" class="relationship">
        <polyline
            :points="path"
            stroke="transparent"
            fill="none"
            stroke-width="25"
            @dblclick="addBendPoint"
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
            v-for="(point, index) in relationship.bendPoints"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            r="5"
            fill="green"
            cursor="pointer"
            @contextmenu.prevent="removeBendPoint(index)"
            @mousedown.stop="startBendDrag(index)"
        />
        <circle
            class="relationship-handle"
            :cx="srcPoint.x"
            :cy="srcPoint.y"
            r="5"
            fill="blue"
            cursor="pointer"
            @mousedown.stop="emit('relationship-drag', { relationship, handleType: 'src' })"
        />
        <circle
            class="relationship-handle"
            :cx="trgPoint.x"
            :cy="trgPoint.y"
            r="5"
            fill="red"
            cursor="pointer"
            @mousedown.stop="emit('relationship-drag', { relationship, handleType: 'trg' })"
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
import { useRelationship } from '@/composables/useRelationship';
import Relationship from '@/models/Relationship.js';

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    }
});
const emit = defineEmits(['relationship-select', 'relationship-drag']);
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
    addBendPoint,
    removeBendPoint,
    allPoints
} = useRelationship(props.relationship);

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

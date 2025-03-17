<template>
    <g>
        <polyline
            :points="composable.path.value"
            stroke="black"
            fill="none"
            stroke-width="2"
            marker-end="url(#arrowhead)"
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
    </g>
</template>

<script setup>
import { useRelationship } from '@/composables/useRelationship'

const props = defineProps({
    relationship: Object,
})
const composable = useRelationship(props.relationship)
</script>

<style scoped>
.relationship-handle {
    stroke: black;
    stroke-width: 2;
    z-index: -1;
}
</style>

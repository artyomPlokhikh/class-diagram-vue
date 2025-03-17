<template>
    <g>
        <polyline :points="composable.path.value"
                  stroke="black"
                  fill="none"
                  stroke-width="2"
                  marker-end="url(#arrowhead)"
        />
    </g>
</template>

<script setup>
import {useRelationship} from '@/composables/useRelationship'

const props = defineProps({
    relationship: Object
})

const composable = useRelationship(props.relationship)
</script>

<template>
    <polyline :points="points"
              stroke="black"
              fill="none"
              stroke-width="2"
              marker-end="url(#arrowhead)"
    />
</template>

<script setup>
import { computed } from 'vue'
import { useRelationship } from '@/composables/useRelationship'

const props = defineProps({
    relationship: Object
})

const composable = useRelationship()


</script>

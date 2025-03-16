<template>
    <polyline :points="points"
              stroke="black"
              fill="none"
              stroke-width="2"
              marker-end="url(#arrowhead)"
              :class="{ selected: relationship.selected }"/>
</template>

<script setup>
import { computed } from 'vue'
import { useDiagramStore } from '@/stores/diagram'
import { useRelationship } from '@/composables/useRelationship'

const props = defineProps({
    relationship: Object
})

const store = useDiagramStore()
const relationshipComposable = useRelationship()

const points = computed(() => {
    return relationshipComposable.computeArrowPoints(props.relationship, store.entities)
})
</script>

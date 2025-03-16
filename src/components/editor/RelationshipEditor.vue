<template>
    <div class="properties-panel">
        <h3>Relationship Properties</h3>

        <div class="form-group">
            <label>Relationship Type:</label>
            <select v-model="relationship.type">
                <option :value="Relationship.TYPES.ONE_TO_ONE">
                    {{ Relationship.TYPES.ONE_TO_ONE }}
                </option>
                <option :value="Relationship.TYPES.ONE_TO_MANY">
                    {{ Relationship.TYPES.ONE_TO_MANY }}
                </option>
                <option :value="Relationship.TYPES.MANY_TO_MANY">
                    {{ Relationship.TYPES.MANY_TO_MANY }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label>Arrow Points:</label>
            <div v-for="(point, index) in relationship.points" :key="index">
                <span>({{ point.x }}, {{ point.y }})</span>
            </div>
        </div>

        <button class="btn-danger" @click="deleteRelationship">
            Delete Relationship
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDiagramStore } from '@/stores/diagram'
import Relationship from '@/models/Relationship'

const store = useDiagramStore()
const relationship = computed(() => store.selected)

const deleteRelationship = () => {
    if (confirm('Delete this relationship?')) {
        store.deleteRelationship(relationship.value.id)
    }
}
</script>

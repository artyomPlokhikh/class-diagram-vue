<template>
    <div class="properties-panel">
        <h3>Relationship Properties</h3>

        <div class="form-group">
            <label>Name:</label>
            <input v-model="relationship.name" placeholder="e.g. manages"/>
        </div>

        <div class="form-group">
            <label>Type:</label>
            <select v-model="relationship.type">
                <option
                    v-for="(val) in Relationship.TYPES"
                    :value="val"
                >
                    {{ capitalize(val) }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label>Source Multiplicity:</label>
            <input
                v-model="relationship.src.mult"
                placeholder="1, 0..*, etc."
            />
        </div>

        <div class="form-group">
            <label>Target Multiplicity:</label>
            <input
                v-model="relationship.trg.mult"
                placeholder="1, 0..*, etc."
            />
        </div>

        <button class="btn-danger" @click="deleteRelationship">
            Delete Relationship
        </button>
    </div>
</template>

<script setup>
import { capitalize, computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import Relationship from '@/models/Relationship';

const store = useDiagramStore();
const relationship = computed(() => store.selected);

const deleteRelationship = () => {
    if (confirm('Delete this relationship?')) {
        store.deleteRelationship(relationship.value.id);
    }
};
</script>

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
                <option v-for="val in Relationship.TYPES" :value="val">
                    {{ capitalize(val) }}
                </option>
            </select>
        </div>

        <div v-if="showMultiplicity" class="form-group">
            <label>Source Multiplicity:</label>
            <select v-model="relationship.src.mult">
                <option v-for="val in multiplicityOptions" :value="val.value">
                    {{ val.label }}
                </option>
            </select>
        </div>

        <div v-if="showMultiplicity" class="form-group">
            <label>Target Multiplicity:</label>
            <select v-model="relationship.trg.mult">
                <option v-for="val in multiplicityOptions" :value="val.value">
                    {{ val.label }}
                </option>

            </select>
        </div>

        <button class="btn-danger" @click="deleteRelationship">
            Delete Relationship
        </button>
    </div>
</template>

<script setup>
import { capitalize, computed, watch } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import Relationship from '@/models/Relationship';
import { debounce } from "@/utils/debounce.js";

const store = useDiagramStore();
const relationship = computed(() => store.selected);

const deleteRelationship = () => {
    store.deleteRelationship(relationship.value.id);
};

const multiplicityOptions = [
    { value: '', label: 'None' },
    { value: '1', label: '1' },
    { value: '0..1', label: '0..1' },
    { value: '0..*', label: '0..*' },
    { value: '1..*', label: '1..*' },
];

const showMultiplicity = (relationship) => {
    return [
        Relationship.TYPES.ASSOCIATION,
        Relationship.TYPES.AGGREGATION,
        Relationship.TYPES.COMPOSITION
    ].includes(relationship.type);
};

const saveRelationship = debounce(() => {
    if (relationship.value) {
        store.save();
    }
}, 2000);

watch(() => relationship.value?.name, saveRelationship);
watch(() => relationship.value?.type, saveRelationship);
watch(() => relationship.value?.src?.mult, saveRelationship);
watch(() => relationship.value?.trg?.mult, saveRelationship);

</script>

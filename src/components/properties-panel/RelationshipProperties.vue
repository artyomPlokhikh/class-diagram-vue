<template>
    <div class="properties">
        <header class="properties__header">
            <h3 class="properties__title">Relationship Properties</h3>
            <button
                class="properties__delete-btn"
                @click="diagramStore.deleteEntity(relationship.id)"
                title="Delete Relationship"
            >
                Delete
            </button>
        </header>

        <div class="properties__group">
            <label class="properties__label">Name:</label>
            <input v-model="relationship.name" class="properties__input"/>
        </div>

        <div class="properties__group">
            <label class="properties__label">Type:</label>
            <select v-model="relationship.type" class="properties__input">
                <option v-for="val in Relationship.TYPES" :value="val">{{ capitalize(val) }}</option>
            </select>
        </div>

        <div v-if="showMultiplicity" class="properties__group">
            <label class="properties__label">Source Multiplicity:</label>
            <select v-model="relationship.src.mult" class="properties__input">
                <option v-for="val in multiplicityOptions" :value="val.value">{{ val.label }}</option>
            </select>
        </div>

        <div v-if="showMultiplicity" class="properties__group">
            <label class="properties__label">Target Multiplicity:</label>
            <select v-model="relationship.trg.mult" class="properties__input">
                <option v-for="val in multiplicityOptions" :value="val.value">{{ val.label }}</option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { capitalize, computed, watch } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import Relationship from '@/models/Relationship';
import { debounce } from "@/utils/debounce.js";

const diagramStore = useDiagramStore();
const relationship = computed(() => diagramStore.selected);

const deleteRelationship = () => {
    diagramStore.deleteRelationship(relationship.value.id);
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
        diagramStore.save();
    }
}, 1000);

watch(() => relationship.value?.name, saveRelationship);
watch(() => relationship.value?.type, saveRelationship);
watch(() => relationship.value?.src?.mult, saveRelationship);
watch(() => relationship.value?.trg?.mult, saveRelationship);

</script>

<template>
    <div class="properties">
        <header class="properties__header">
            <h3 class="properties__title">Relationship Properties</h3>
            <button
                class="properties__delete-btn"
                @click="diagramStore.deleteRelationship(relationship.id)"
                title="Delete Relationship"
            >
                Delete
            </button>
        </header>

        <div class="properties__group">
            <label class="properties__label" for="rel-name">Name:</label>
            <input
                id="rel-name"
                v-model.trim="relationship.name"
                class="properties__input"
                placeholder="e.g., owns"
                autofocus
            />
        </div>

        <div class="properties__group">
            <label class="properties__label" for="rel-type">Type:</label>
            <select
                id="rel-type"
                v-model="relationship.type"
                class="properties__input"
            >
                <option disabled value="">Select type</option>
                <option
                    v-for="val in Relationship.TYPES"
                    :key="val"
                    :value="val"
                >
                    {{ capitalize(val) }}
                </option>
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

const multiplicityOptions = [
    { value: '', label: 'None' },
    { value: '1', label: '1' },
    { value: '0..1', label: '0..1' },
    { value: '0..*', label: '0..*' },
    { value: '1..*', label: '1..*' },
];

const showMultiplicity = computed(() =>
    [
        Relationship.TYPES.ASSOCIATION,
        Relationship.TYPES.AGGREGATION,
        Relationship.TYPES.COMPOSITION
    ].includes(relationship.value?.type)
)

const saveRelationship = debounce(() => {
    if (relationship.value) diagramStore.save()
}, 800)

watch(
    () => relationship.value,
    saveRelationship,
    { deep: true }
)
</script>

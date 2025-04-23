<template>
    <div class="properties-panel">
        <h3>Entity Properties</h3>

        <div class="form-group">
            <label>Entity Name:</label>
            <input v-model="entity.name" class="entity-name-input" />
        </div>

        <h4>Attributes</h4>
        <div class="attributes-list">
            <div
                v-for="(attr, index) in entity.attributes"
                :key="index"
                class="attribute-item"
            >
                <input v-model="attr.name" placeholder="Attribute name" class="attribute-name-input"/>
                <select v-model="attr.type" class="attribute-select">
                    <option>INT</option>
                    <option>VARCHAR</option>
                    <option>DATE</option>
                </select>
                <select v-model="attr.visibility" class="attribute-select">
                    <option v-for="option in Object.values(Attribute.VISIBILITY)" :key="option.name" :value="option">
                        {{ capitalize(option.name) }}
                    </option>
                </select>
                <button @click="removeAttribute(index)" class="remove-btn">
                    ×
                </button>
            </div>
            <button @click="addAttribute" class="add-attribute-btn">
                + Add Attribute
            </button>
        </div>
    </div>
</template>

<script setup>
import { capitalize, computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import Attribute from "@/models/Attribute.js";

const store = useDiagramStore();
const entity = computed(() => store.selected);

const addAttribute = () => {
    entity.value.addAttribute();
};

const removeAttribute = (index) => {
    entity.value.attributes.splice(index, 1);
};
</script>

<style scoped>
.properties-panel select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    font-size: 1rem;
    margin-top: 0.25rem;
}

.attribute-name-input {
    width: 80px;
}

.attribute-select {
    width: 120px;
}
</style>
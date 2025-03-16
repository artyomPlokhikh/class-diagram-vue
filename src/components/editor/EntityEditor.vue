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
                <input v-model="attr.name" placeholder="Attribute name" />
                <select v-model="attr.type">
                    <option>INT</option>
                    <option>VARCHAR</option>
                    <option>DATE</option>
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
import { computed } from 'vue'
import { useDiagramStore } from '@/stores/diagram'

const store = useDiagramStore()
const entity = computed(() => store.selected)

const addAttribute = () => {
    entity.value.addAttribute()
}

const removeAttribute = (index) => {
    entity.value.attributes.splice(index, 1)
}
</script>
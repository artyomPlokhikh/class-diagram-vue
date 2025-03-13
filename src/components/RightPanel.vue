<template>
    <div class="right-panel-content">
        <div v-if="selectedEntity" class="properties-panel">
            <h3>Properties</h3>

            <div class="form-group">
                <label>Entity Name:</label>
                <input v-model="selectedEntity.name" class="entity-name-input"/>
            </div>

            <h4>Attributes</h4>
            <div class="attributes-list">
                <div v-for="(attr, index) in selectedEntity.attributes"
                     :key="index"
                     class="attribute-item">
                    <input v-model="attr.name" placeholder="Attribute name"/>
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

        <div v-else class="empty-properties">
            Select an entity to edit properties
        </div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {useDiagramStore} from '../stores/diagram'

const store = useDiagramStore()
const selectedEntity = computed(() => store.selectedEntity)

const addAttribute = () => {
    selectedEntity.value.addAttribute({
        name: 'new_attribute',
        type: 'VARCHAR'
    });
}

const removeAttribute = (index) => {
    selectedEntity.value.attributes.splice(index, 1)
}
</script>

<style scoped>
.right-panel-content {
    padding: 16px;
    height: 100%;
}

.properties-panel h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
}

.properties-panel h4 {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 16px 0 8px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
}

.entity-name-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.attributes-list {
    margin-top: 8px;
}

.attribute-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.attribute-item input {
    flex: 1;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.attribute-item select {
    width: 100px;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.remove-btn {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    padding: 0 8px;
}

.add-attribute-btn {
    width: 100%;
    padding: 8px;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 8px;
    font-size: 14px;
}

.add-attribute-btn:hover {
    background: #e9ecef;
}

.empty-properties {
    padding: 16px;
    color: #666;
    text-align: center;
    font-size: 14px;
}
</style>
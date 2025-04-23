<template>
    <div class="attributes-list">
        <div v-for="(attr) in attributes" :key="attr.id" class="attribute-item">
            <input v-model="attr.name" placeholder="Attribute name" class="attribute-name-input"/>
            <select v-model="attr.type" class="attribute-select">
                <option v-for="option in filteredTypes" :key="option.name" :value="option">
                    {{ option.name }}
                </option>
            </select>
            <select v-model="attr.visibility" class="attribute-select">
                <option v-for="option in Object.values(Visibility)" :key="option.name" :value="option">
                    {{ capitalize(option.name) }}
                </option>
            </select>
            <button @click="$emit('remove-attribute', attr.id)" class="remove-btn">×</button>
        </div>
        <button @click="$emit('add-attribute')" class="add-attribute-btn">+ Add Attribute</button>
    </div>
</template>

<script setup>
import { computed, capitalize } from 'vue';
import TYPE from '@/models/Type.js';
import Visibility from '@/models/Visibility.js';

const props = defineProps({
    attributes: { type: Array, required: false }
});

const filteredTypes = computed(() =>
    Object.values(TYPE).filter((type) => type.name !== 'void')
);
</script>
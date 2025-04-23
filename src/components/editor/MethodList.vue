<template>
    <div class="methods-list">
        <div v-for="(method) in methods" :key="method.id" class="method-item">
            <input v-model="method.name" placeholder="Method name" class="method-name-input"/>
            <select v-model="method.type" class="method-select">
                <option v-for="option in Object.values(Type)" :key="option.name" :value="option">
                    {{ option.name }}
                </option>
            </select>
            <select v-model="method.visibility" class="method-select">
                <option v-for="option in Object.values(Visibility)" :key="option.name" :value="option">
                    {{ capitalize(option.name) }}
                </option>
            </select>
            <button @click="$emit('remove-method', method.id)" class="remove-btn">×</button>
        </div>
        <button @click="$emit('add-method')" class="add-method-btn">+ Add Method</button>
    </div>
</template>

<script setup>
import { capitalize } from 'vue';
import Visibility from '@/models/Visibility.js';
import Type from "@/models/Type.js";

const props = defineProps({
    methods: { type: Array, required: false }
});

</script>
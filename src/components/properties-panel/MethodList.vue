<template>
    <div class="properties-list">
        <div
            v-for="method in methods"
            :key="method.id"
            class="properties-list__item"
        >
            <input
                v-model="method.name"
                placeholder="Method name"
                class="properties-list__input"
            />
            <select v-model="method.type" class="properties-list__select">
                <option
                    v-for="option in Object.values(Type)"
                    :key="option.name"
                    :value="option"
                >
                    {{ option.name }}
                </option>
            </select>
            <select v-model="method.visibility" class="properties-list__select">
                <option
                    v-for="option in Object.values(Visibility)"
                    :key="option.name"
                    :value="option"
                >
                    {{ capitalize(option.name) }}
                </option>
            </select>
            <button
                class="properties-list__remove"
                @click="$emit('remove-method', method.id)"
            >
                ×
            </button>
        </div>
    </div>
    <button
        class="button properties-list__add"
        @click="$emit('add-method')"
    >
        + Add Method
    </button>
</template>


<script setup>
import { capitalize } from 'vue';
import Visibility from '@/models/Visibility.js';
import Type from "@/models/Type.js";

const props = defineProps({
    methods: { type: Array, required: false }
});

const emit = defineEmits(['add-method', 'remove-method']);

</script>
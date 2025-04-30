<template>
    <div class="prop-list">
        <div
            v-for="attr in attributes"
            :key="attr.id"
            class="prop-list__item"
        >
            <input
                v-model="attr.name"
                placeholder="Attribute name"
                class="prop-list__input"
            />
            <select v-model="attr.type" class="prop-list__select">
                <option
                    v-for="option in filteredTypes"
                    :key="option.name"
                    :value="option"
                >
                    {{ option.name }}
                </option>
            </select>
            <select v-model="attr.visibility" class="prop-list__select">
                <option
                    v-for="option in Object.values(Visibility)"
                    :key="option.name"
                    :value="option"
                >
                    {{ capitalize(option.name) }}
                </option>
            </select>
            <button
                class="prop-list__remove"
                @click="$emit('remove-attribute', attr.id)"
            >
                ×
            </button>
        </div>

        <button
            class="prop-list__add"
            @click="$emit('add-attribute')"
        >
            + Add Attribute
        </button>
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
<template>
    <select
        v-model="selectedAnnotation"
        class="properties__select"
    >
        <option value="">None</option>
        <option
            v-for="option in Object.values(ANNOTATION)"
            :key="option.name"
            :value="option.name"
        >
            {{ capitalize(option.name) }}
        </option>
    </select>
</template>


<script setup>
import { computed } from 'vue';
import { capitalize } from 'vue';
import ANNOTATION from '@/models/Annotation.js';

const props = defineProps({
    annotation: { type: String, default: '' }
});

const emit = defineEmits(['update:annotation']);

const selectedAnnotation = computed({
    get: () => props.annotation,
    set: (value) => emit('update:annotation', value)
});
</script>
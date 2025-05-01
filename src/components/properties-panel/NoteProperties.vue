<template>
    <div class="properties">
        <h3 class="properties__title">Note Properties</h3>

        <div class="properties__group">
            <label class="properties__label" for="note-content">Content</label>
            <textarea
                id="note-content"
                v-model="note.content"
                class="properties__input"
                rows="4"
            ></textarea>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useDiagramStore } from '@/stores/diagram.js';
import { debounce } from '@/utils/debounce.js';

const diagramStore = useDiagramStore();
const note = computed(() => diagramStore.selected);

const saveNote = debounce(() => {
    if (note.value) {
        diagramStore.save();
    }
}, 1000);

watch(() => note.value?.content, saveNote);
</script>

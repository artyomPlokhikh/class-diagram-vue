<template>
    <div class="properties-panel">
        <h3>Note Properties</h3>

        <div class="form-group">
            <label for="note-content">Content</label>
            <textarea
                id="note-content"
                v-model="note.content"
                class="note-content-input"
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
}, 2000);

watch(() => note.value?.content, saveNote);
</script>

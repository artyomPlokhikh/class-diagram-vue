<template>
    <div class="app__toolbar">
        <button class="button toolbar__button" @click="diagramStore.save">Save</button>
        <button class="button toolbar__button" @click="diagramStore.undo">Undo</button>
        <button class="button toolbar__button" @click="diagramStore.redo">Redo</button>
        <button class="button toolbar__button" @click="showExportModal = true">Export</button>
        <button class="button toolbar__button button--danger" @click="diagramStore.clearDiagram">Clear</button>
    </div>

    <ExportModal 
        :isOpen="showExportModal"
        @close="showExportModal = false"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useDiagramStore } from "@/stores/diagram.js";
import ExportModal from '@/components/modals/ExportModal.vue';

const diagramStore = useDiagramStore();
const showExportModal = ref(false);
</script>

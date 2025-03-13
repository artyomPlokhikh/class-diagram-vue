<template>
    <div class="toolbar">
        <button @click="save">Save</button>
        <button @click="undo">Undo</button>
        <button @click="redo">Redo</button>
        <button @click="exportDiagram">Export</button>
    </div>
</template>

<script setup>
import { useDiagramStore } from '../stores/diagram'

const store = useDiagramStore()

const save = () => store.saveState()
const undo = () => store.undo()
const redo = () => store.redo()
const exportDiagram = () => store.exportDiagram()
</script>

<style scoped>
.toolbar {
    padding: 10px;
    background: #f0f0f0;
    border-bottom: 1px solid #ccc;
    display: flex;
    gap: 10px;
}
</style>
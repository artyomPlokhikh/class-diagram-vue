<template>
    <div class="toolbar">
        <button @click="save">Save</button>
        <button @click="undo">Undo</button>
        <button @click="redo">Redo</button>
        <button @click="exportDiagram">Export</button>
        <button @click="clear">Clear</button>
    </div>
</template>

<script setup>
import {useDiagramStore} from '../stores/diagram'

const store = useDiagramStore()

const save = () => store.saveState()
const undo = () => store.undo()
const redo = () => store.redo()
const exportDiagram = () => store.exportDiagram()
const clear = () => store.clear()
</script>
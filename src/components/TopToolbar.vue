<template>
    <div class="toolbar">
        <button @click="diagramStore.save">Save</button>
        <button @click="diagramStore.undo">Undo</button>
        <button @click="diagramStore.redo">Redo</button>
        <button @click="diagramStore.clearDiagram">Clear</button>
    </div>
</template>

<script setup>
import { useDiagramStore } from "@/stores/diagram.js";

const diagramStore = useDiagramStore();
</script>
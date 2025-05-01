<template>
    <div class="app__toolbar">
        <button class="button toolbar__button" @click="diagramStore.save">Save</button>
        <button class="button toolbar__button" @click="diagramStore.undo">Undo</button>
        <button class="button toolbar__button" @click="diagramStore.redo">Redo</button>
        <button class="button toolbar__button button--danger" @click="diagramStore.clearDiagram">Clear</button>
    </div>
</template>

<script setup>
import { useDiagramStore } from "@/stores/diagram.js";

const diagramStore = useDiagramStore();
</script>
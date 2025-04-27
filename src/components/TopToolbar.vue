<template>
    <div class="toolbar">
        <button @click="store.save">Save</button>
        <button @click="store.undo">Undo</button>
        <button @click="store.redo">Redo</button>
        <button @click="store.clearDiagram">Clear</button>
    </div>
</template>

<script setup>
import { inject } from "vue";

const store = inject("diagramStore");
</script>
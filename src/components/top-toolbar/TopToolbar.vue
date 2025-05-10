<template>
    <div class="app__toolbar">
        <button class="button toolbar__button" @click="diagramStore.save">Save</button>
        <button class="button toolbar__button" @click="diagramStore.undo">Undo</button>
        <button class="button toolbar__button" @click="diagramStore.redo">Redo</button>
        <button class="button toolbar__button" @click="exportSVG">SVG Export</button>
        <button class="button toolbar__button" @click="exportPNG">PNG Export</button>
        <button class="button toolbar__button" @click="exportJPG">JPG Export</button>
        <button class="button toolbar__button button--danger" @click="diagramStore.clearDiagram">Clear</button>
    </div>
</template>

<script setup>
import { useDiagramStore } from "@/stores/diagram.js";
import { exportAsSVG, exportAsPNG, exportAsJPG } from '@/utils/exportDiagram';
import { useCameraStore } from "@/stores/camera.js";

const cameraStore = useCameraStore();
const diagramStore = useDiagramStore();

const exportSVG = () => exportAsSVG(cameraStore.container, diagramStore, cameraStore);
const exportPNG = () => exportAsPNG(cameraStore.container, diagramStore, cameraStore);
const exportJPG = () => exportAsJPG(cameraStore.container, diagramStore, cameraStore);
</script>

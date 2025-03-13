<template>
    <div class="app-container">
        <TopToolbar />

        <div class="main-layout">
            <LeftPanel class="left-panel" />
            <CanvasArea class="canvas-area" />
            <RightPanel class="right-panel" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDiagramStore } from '@/stores/diagram'
import TopToolbar from '@/components/TopToolbar.vue'
import LeftPanel from '@/components/LeftPanel.vue'
import RightPanel from '@/components/RightPanel.vue'
import CanvasArea from '@/components/CanvasArea.vue'

const store = useDiagramStore()

onMounted(() => {
    store.loadState()
})
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>

<style scoped>
.app-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
}

.main-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr 320px;
    grid-template-rows: 1fr;
    grid-template-areas: "left canvas right";
    height: calc(100vh - 50px);
}

.left-panel {
    grid-area: left;
    border-right: 1px solid #e0e0e0;
    background: white;
}

.canvas-area {
    grid-area: canvas;
    position: relative;
    background: #fafafa;
}

.right-panel {
    grid-area: right;
    border-left: 1px solid #e0e0e0;
    background: white;
}
</style>
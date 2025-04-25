<template>
    <div class="app-container">
        <TopToolbar/>

        <div class="main-layout">
            <LeftPanel class="left-panel"/>
            <CanvasArea class="canvas-area"/>
            <RightPanel class="right-panel"/>
        </div>
    </div>
</template>

<script setup>
import { onMounted, provide } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import TopToolbar from '@/components/TopToolbar.vue';
import LeftPanel from '@/components/LeftPanel.vue';
import RightPanel from '@/components/RightPanel.vue';
import CanvasArea from '@/components/CanvasArea.vue';
import { useKeyboard } from '@/composables/useKeyboard.js';


const store = useDiagramStore();

const keys = useKeyboard();
provide('shiftPressed', keys.shift);

onMounted(() => {
    store.loadState();
});

</script>
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
import { useSnapping } from "@/composables/useSnapping.js";

const diagramStore = useDiagramStore();
provide('diagramStore', diagramStore);

const keys = useKeyboard();
provide('shiftPressed', keys.shift);
provide('ctrlPressed', keys.ctrl);

const snapping = useSnapping(diagramStore, keys.ctrl);
provide('snapping', snapping);

onMounted(() => {
    diagramStore.loadState();
});

</script>
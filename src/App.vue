<template>
    <div class="app">
        <TopToolbar/>

        <div class="app__main">
            <PalettePanel/>
            <PropertiesPanel/>
            <DiagramCanvas/>
        </div>

        <MobileWarningModal/>
    </div>
</template>

<script setup>
import { onMounted, provide } from 'vue';
import TopToolbar from '@/components/top-toolbar/TopToolbar.vue';
import PalettePanel from '@/components/palette-panel/PalettePanel.vue';
import PropertiesPanel from '@/components/properties-panel/PropertiesPanel.vue';
import DiagramCanvas from '@/components/diagram/DiagramCanvas.vue';
import MobileWarningModal from './components/modals/MobileWarningModal.vue';
import { useDiagramStore } from '@/stores/diagram';
import { useKeyboard } from '@/composables/useKeyboard.js';
import { useSnapping } from "@/composables/useSnapping.js";

const diagramStore = useDiagramStore();
provide('diagramStore', diagramStore);

const keys = useKeyboard(diagramStore);
provide('shiftPressed', keys.shift);
provide('ctrlPressed', keys.ctrl);

const snapping = useSnapping(diagramStore, keys.ctrl);
provide('snapping', snapping);

onMounted(() => {
    diagramStore.init();
});

</script>
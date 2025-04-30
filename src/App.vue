<template>
    <div class="app">
        <TopToolbar class="app__toolbar"/>

        <div class="app__main">
            <PalettePanel class="palette-panel"/>
            <DiagramCanvas class="diagram"/>
            <PropertiesPanel class="properties-panel"/>
        </div>
    </div>
</template>

<script setup>
import { onMounted, provide } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import TopToolbar from '@/components/top-toolbar/TopToolbar.vue';
import PalettePanel from '@/components/palette-panel/PalettePanel.vue';
import PropertiesPanel from '@/components/properties-panel/PropertiesPanel.vue';
import DiagramCanvas from '@/components/diagram/DiagramCanvas.vue';
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
<template>
    <Modal :isOpen="isOpen" title="Export Diagram" @close="$emit('close')">
        <template #content>
            <form @submit.prevent="exportDiagram" class="properties">
                <div class="properties__group">
                    <label for="export-format">Format:</label>
                    <select id="export-format" v-model="exportOptions.format" class="properties__select">
                        <option value="svg">SVG</option>
                        <option value="png">PNG</option>
                        <option value="jpg">JPEG</option>
                        <option value="json">JSON</option>
                    </select>
                </div>

                <div class="properties__group">
                    <label for="export-filename">Filename:</label>
                    <input
                        id="export-filename"
                        v-model="exportOptions.filename"
                        class="properties__input"
                        :placeholder="`diagram.${exportOptions.format}`"
                    />
                </div>

                <div v-if="['svg', 'png', 'jpg'].includes(exportOptions.format)" class="properties__group">
                    <label for="export-padding">Padding (px):</label>
                    <input
                        id="export-padding"
                        v-model.number="exportOptions.padding"
                        type="number"
                        min="0"
                        class="properties__input"
                    />
                </div>

                <div v-if="['svg', 'png', 'jpg'].includes(exportOptions.format)" class="properties__group">
                    <label for="export-background">Background:</label>
                    <input
                        id="export-background"
                        v-model="exportOptions.backgroundColor"
                        type="text"
                        class="properties__input"
                    />
                </div>

                <div v-if="['svg', 'png', 'jpg'].includes(exportOptions.format)" class="properties__group">
                    <label for="export-safety-margin">Safety Margin:</label>
                    <input
                        id="export-safety-margin"
                        v-model.number="exportOptions.safetyMargin"
                        type="number"
                        min="0"
                        step="0.05"
                        class="properties__input"
                    />
                </div>

                <div v-if="['png', 'jpg'].includes(exportOptions.format)" class="properties__group">
                    <label for="export-scale">Scale:</label>
                    <input
                        id="export-scale"
                        v-model.number="exportOptions.scale"
                        type="number"
                        min="0.5"
                        step="0.5"
                        max="4"
                        class="properties__input"
                    />
                </div>

                <div v-if="exportOptions.format === 'jpg'" class="properties__group">
                    <label for="export-quality">Quality:</label>
                    <input
                        id="export-quality"
                        v-model.number="exportOptions.quality"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        class="properties__input"
                    />
                    <span>{{ (exportOptions.quality * 100).toFixed(0) }}%</span>
                </div>
            </form>
        </template>
        <template #footer>
            <button class="button button--secondary" @click="$emit('close')">Cancel</button>
            <button class="button button--primary" @click="exportDiagram">Export</button>
        </template>
    </Modal>
</template>

<script setup>
import { reactive, watch } from 'vue';
import Modal from '@/components/modals/Modal.vue'
import { exportAsSVG, exportAsPNG, exportAsJPG, exportAsJson } from '@/utils/exportDiagram';
import { useDiagramStore } from '@/stores/diagram.js';
import { useCameraStore } from '@/stores/camera.js';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const diagramStore = useDiagramStore();
const cameraStore = useCameraStore();

const exportOptions = reactive({
    format: 'svg',
    padding: 20,
    backgroundColor: 'transparent',
    filename: '',
    safetyMargin: 0.1,
    scale: 2,
    quality: 0.95
});

const updateFilename = () => {
    if (exportOptions.filename.match(/\.(svg|png|jpe?g)$/i)) {
        exportOptions.filename = exportOptions.filename.replace(/\.(svg|png|jpe?g)$/i, `.${exportOptions.format}`);
    }

    if (['svg', 'png'].includes(exportOptions.format) && exportOptions.backgroundColor === 'white') {
        exportOptions.backgroundColor = 'transparent';
    } else if (!['svg', 'png'].includes(exportOptions.format) && exportOptions.backgroundColor === 'transparent') {
        exportOptions.backgroundColor = 'white';
    }
};

watch(() => exportOptions.format, updateFilename);

const exportDiagram = async () => {
    const container = cameraStore.container;
    const options = { ...exportOptions };

    if (!options.filename.endsWith(`.${options.format}`)) {
        options.filename = options.filename || `diagram.${options.format}`;
    }

    try {
        if (options.format === 'svg') {
            await exportAsSVG(container, diagramStore, cameraStore, options);
        } else if (options.format === 'png') {
            await exportAsPNG(container, diagramStore, cameraStore, options);
        } else if (options.format === 'jpg') {
            await exportAsJPG(container, diagramStore, cameraStore, options);
        } else if (options.format === 'json') {
            await exportAsJson(diagramStore, options);
        }
        emit('close');
    } catch (error) {
        console.error('Export failed:', error);
    }
};
</script>

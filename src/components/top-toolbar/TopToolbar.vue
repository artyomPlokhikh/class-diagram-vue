<template>
    <div class="app__toolbar">
        <div class="toolbar__group">
            <button class="button toolbar__button" title="Save to localStorage" @click="diagramStore.save">
                <SaveIcon/>
                Save
            </button>
            <label class="button toolbar__button" title="Load from JSON file">
                <UploadIcon/>
                Import
                <input type="file" accept=".json" @change="loadFromFile" style="display: none"/>
            </label>
            <button class="button toolbar__button" title="Export diagram" @click="showExportModal = true">
                <ExportIcon/>
                Export
            </button>
            <button class="button toolbar__button" title="Show Help" @click="showHelpModal = true">
                <HelpIcon/>
                Help
            </button>
        </div>

        <div class="toolbar__group toolbar__group--right">
            <div class="toolbar__group">
                <button
                    class="button toolbar__button toolbar__icon-button"
                    :class="{ 'button--disabled': !diagramStore.canUndo }"
                    title="Undo"
                    @click="diagramStore.undo()"
                >
                    <UndoIcon/>
                </button>
                <button
                    class="button toolbar__button toolbar__icon-button"
                    :class="{ 'button--disabled': !diagramStore.canRedo }"
                    title="Redo"
                    @click="diagramStore.redo()"
                >
                    <RedoIcon/>
                </button>
            </div>
            <button class="button toolbar__button button--danger" title="Clear diagram" @click="showConfirmClear = true">
                <ClearIcon/>
                Clear
            </button>
        </div>
    </div>

    <ExportModal
        :isOpen="showExportModal"
        @close="showExportModal = false"
    />

    <HelpModal
        :isOpen="showHelpModal"
        @close="showHelpModal = false"
    />

    <ConfirmModal
        :isOpen="showConfirmClear"
        @close="showConfirmClear = false"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useDiagramStore } from "@/stores/diagram.js";
import ExportModal from '@/components/modals/ExportModal.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import SaveIcon from "@/components/icons/SaveIcon.vue";
import UploadIcon from "@/components/icons/UploadIcon.vue";
import UndoIcon from "@/components/icons/UndoIcon.vue";
import RedoIcon from "@/components/icons/RedoIcon.vue";
import ExportIcon from "@/components/icons/ExportIcon.vue";
import ClearIcon from "@/components/icons/ClearIcon.vue";
import HelpIcon from "@/components/icons/HelpIcon.vue";
import HelpModal from "@/components/modals/HelpModal.vue";

const diagramStore = useDiagramStore();
const showExportModal = ref(false);
const showHelpModal = ref(false);
const showConfirmClear = ref(false);

const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            diagramStore.importJSON(content);
        } catch (error) {
            console.error('Error loading file:', error);
            alert('Could not load the diagram file. The file might be corrupted.');
        }
        event.target.value = null;
    };
    reader.readAsText(file);
};

</script>

<template>
    <Modal
        :isOpen="isOpen"
        title="Clear Diagram"
        :closeOnOverlayClick="false"
        @close="cancelClear"
    >
        <template #content>
            <p>Are you sure you want to clear the entire diagram? This action cannot be undone.</p>
        </template>

        <template #footer>
            <button class="button" @click="cancelClear">Cancel</button>
            <button class="button button--danger" @click="clearDiagram">Clear</button>
        </template>
    </Modal>
</template>

<script setup>
import { useDiagramStore } from "@/stores/diagram.js";
import Modal from "@/components/modals/Modal.vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const diagramStore = useDiagramStore();

const cancelClear = () => {
    emit('close');
};

const clearDiagram = () => {
    diagramStore.clearDiagram();
    emit('close');
};
</script>
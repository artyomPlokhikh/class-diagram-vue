<template>
    <Modal
        :isOpen="isVisible"
        title="Desktop Recommended"
        :closeOnOverlayClick="false"
        @close="hideModal"
    >
        <p>This ERD tool is designed for optimal use on desktop devices. Some features may be limited on mobile.</p>

        <template #footer>
            <button class="button button--primary" @click="hideModal">I understand</button>
        </template>
    </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Modal from '@/components/modals/Modal.vue';

const isVisible = ref(false);

onMounted(() => {
    if (window.innerWidth < 992) {
        const hasShownWarning = localStorage.getItem('erd-mobile-warning-shown');
        if (!hasShownWarning) {
            isVisible.value = true;
        }
    }
});

const hideModal = () => {
    isVisible.value = false;
    localStorage.setItem('erd-mobile-warning-shown', 'true');
};
</script>

<template>
    <transition name="fade">
        <div v-if="showIndicator" class="status-indicator">
            {{ isOnline ? 'Connection restored' : 'You are working offline' }}
        </div>
    </transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useConnectionStatus } from '@/composables/useConnectionStatus.js';

const { isOnline } = useConnectionStatus();
const showIndicator = ref(false);
let hideTimer = null;

function clearHideTimer() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}

watch(
    isOnline,
    (newStatus, oldStatus) => {
        if (oldStatus === undefined && newStatus) return;

        clearHideTimer();
        showIndicator.value = true;

        if (newStatus) {
            hideTimer = setTimeout(() => {
                showIndicator.value = false;
            }, 3000);
        }
    },
    { immediate: true }
);

onBeforeUnmount(clearHideTimer);
</script>

<style scoped>
.status-indicator {
    font-size: 0.9rem;
    padding: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

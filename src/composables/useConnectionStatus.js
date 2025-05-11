import { ref, onMounted, onUnmounted } from 'vue';

export function useConnectionStatus() {
    const isOnline = ref(navigator.onLine);

    const updateOnlineStatus = () => {
        isOnline.value = navigator.onLine;
        console.log(navigator.onLine)
    };

    onMounted(() => {
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    });

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
    });

    return { isOnline };
}
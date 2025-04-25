import { ref, onMounted, onUnmounted } from 'vue';

export function useKeyboard() {
    const keys = {
        shift: ref(false),
        // ctrl: ref(false),
        // alt: ref(false),
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Shift') keys.shift.value = true;
        // if (e.key === 'Control') keys.ctrl.value = true;
        // if (e.key === 'Alt') keys.alt.value = true;
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Shift') keys.shift.value = false;
        // if (e.key === 'Control') keys.ctrl.value = false;
        // if (e.key === 'Alt') keys.alt.value = false;
    };

    onMounted(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    });

    return keys;
}
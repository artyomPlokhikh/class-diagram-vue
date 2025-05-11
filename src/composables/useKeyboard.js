/**
 * Keyboard Shortcut Manager
 *
 * The keyboard state is exposed as reactive references for use in other components.
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useKeyboard(diagramStore) {
    const keys = {
        shift: ref(false),
        ctrl: ref(false),
        alt: ref(false),
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Shift') keys.shift.value = true;
        if (e.key === 'Control') keys.ctrl.value = true;
        if (e.key === 'Alt') keys.alt.value = true;

        if (keys.ctrl.value) {
            if (e.key === 'z' || e.key === 'Z') {
                keys.alt.value
                    // Ctrl + Z for undo
                    ? diagramStore.redo()
                    // Ctrl + Alt + Z for redo
                    : diagramStore.undo();
                e.preventDefault();
            } else if (e.key === 'y' || e.key === 'Y') {
                // Ctrl + Y for redo
                diagramStore.redo();
                e.preventDefault();
            } else if (e.key === 's' || e.key === 'S') {
                // Ctrl + S for save
                diagramStore.save();
                e.preventDefault();
            }
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Shift') keys.shift.value = false;
        if (e.key === 'Control') keys.ctrl.value = false;
        if (e.key === 'Alt') keys.alt.value = false;
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

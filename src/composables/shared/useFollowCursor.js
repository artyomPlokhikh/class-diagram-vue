/**
 * Cursor Following Utility
 *
 * This composable provides a simple way to track cursor movements and handle related events.
 * It's used primarily for relationship drawing, where an element needs to follow the cursor
 * until the operation is completed or canceled.
 */
import { onUnmounted } from 'vue';

export function useFollowCursor({ onMove, onMouseDown, onMouseUp, onContextMenu, onEscape }) {
    const keyHandler = (e) => {
        if (e.key === 'Escape') onEscape?.(e);
    };
    const start = () => {
        if (onMove) window.addEventListener('mousemove', onMove);
        if (onMouseDown) window.addEventListener('mousedown', onMouseDown);
        if (onMouseUp) window.addEventListener('mouseup', onMouseUp);
        if (onContextMenu) window.addEventListener('contextmenu', onContextMenu);
        if (onEscape) window.addEventListener('keydown', keyHandler);
    };
    const stop = () => {
        if (onMove) window.removeEventListener('mousemove', onMove);
        if (onMouseDown) window.removeEventListener('mousedown', onMouseDown);
        if (onMouseUp) window.removeEventListener('mouseup', onMouseUp);
        if (onContextMenu) window.removeEventListener('contextmenu', onContextMenu);
        if (onEscape) window.removeEventListener('keydown', keyHandler);
    };
    onUnmounted(stop);
    return { start, stop };
}

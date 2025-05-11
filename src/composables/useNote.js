/**
 * Note Element Behavior Manager
 *
 * This follows the same composition pattern used for other rectangle-based elements.
 */
import { useConnectableRect } from "@/composables/shared/useConnectableRect.js";
import { useMovableRect } from "@/composables/shared/useMovableRect.js";
import { useResizableRect } from "@/composables/shared/useResizableRect.js";

export function useNote(model, noteRef, isSelected, emit) {
    // Hovering state
    const {
        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick
    } = useConnectableRect(model, noteRef, emit, 'relationship-connect', 'note');

    // Movable state
    const { isDragging, startDragging } = useMovableRect(model);

    // Resizable state
    const {
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized
    } = useResizableRect(model, noteRef)


    function handlePointerDown(e) {
        emit('note-select');
        startDragging(e);
    }

    return {
        handlePointerDown,

        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick,

        isDragging,

        isResizing,
        startResizing,
        resetSize,
        isManuallyResized,
    }
}

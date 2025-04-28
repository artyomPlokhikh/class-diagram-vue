import { useConnectableRect } from "@/composables/shared/useConnectableRect.js";
import { useMovableRect } from "@/composables/shared/useMovableRect.js";
import { useResizableRect } from "@/composables/shared/useResizableRect.js";

export function useEntity(model, entityRef, isSelected, emit) {
    // Hovering state
    const {
        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick
    } = useConnectableRect(model, entityRef, emit, 'relationship-connect', 'entity');

    // Movable state
    const { isDragging, startDragging } = useMovableRect(model);

    // Resizable state
    const {
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized
    } = useResizableRect(model, entityRef)


    function handlePointerDown(e) {
        emit('entity-select');
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
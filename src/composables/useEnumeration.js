import { useConnectableRect } from "@/composables/shared/useConnectableRect.js";
import { useMovableRect } from "@/composables/shared/useMovableRect.js";
import { useResizableRect } from "@/composables/shared/useResizableRect.js";

export function useEnumeration(model, enumerationRef, isSelected, emit) {
    // Hovering state
    const {
        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick
    } = useConnectableRect(model, enumerationRef, emit, 'relationship-connect', 'enumeration');

    // Movable state
    const { isDragging, startDragging } = useMovableRect(model);

    // Resizable state
    const {
        isResizing,
        startResizing,
        resetSize,
        isManuallyResized
    } = useResizableRect(model, enumerationRef)

    function handlePointerDown(e) {
        emit('enumeration-select');
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
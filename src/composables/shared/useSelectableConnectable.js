import { ref } from 'vue';
import { useHoverPreview } from '@/composables/useHoverPreview.js';
import { calculateBorderRelativePosition } from '@/utils/mathHelpers.js';

export function useSelectableConnectable(
    model,
    elRef,
    isSelected,
    emit,
    { selectEvent, connectEvent, type }
) {
    const isHovering = ref(false);
    const { handleEntityBorderHover, clearPreview } = useHoverPreview();

    const onPointerDown = (e) => {
        emit(selectEvent);
    }

    const onBorderHover = (e, side) => {
        isHovering.value = true;
        handleEntityBorderHover(e, elRef.value, side);
    }

    const onBorderLeave = () => {
        isHovering.value = false;
        clearPreview();
    }

    const onBorderClick = (e, side) => {
        emit(selectEvent);
        const rect = elRef.value.getBoundingClientRect();
        const pos = calculateBorderRelativePosition(
            rect,
            side,
            { x: e.clientX, y: e.clientY }
        );

        const payload = {
            type: type,
            id: model.id,
            border: side,
            position: pos
        };

        emit(connectEvent, payload);
    }

    return {
        isHovering,
        onPointerDown,
        onBorderHover,
        onBorderLeave,
        onBorderClick,
    };
}

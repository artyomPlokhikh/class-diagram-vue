import { ref } from 'vue';
import { useHoverPreview } from '@/composables/useHoverPreview.js';
import { calculateBorderRelativePosition } from '@/utils/mathHelpers.js';

export function useConnectableRect(model, elRef, emit, connectEvent, type) {
    const isHovering = ref(false);
    const { handleEntityBorderHover, clearPreview } = useHoverPreview();

    function onBorderHover(e, side) {
        isHovering.value = true;
        handleEntityBorderHover(e, elRef.value, side);
    }

    function onBorderLeave() {
        isHovering.value = false;
        clearPreview();
    }

    function onBorderClick(e, side) {
        const rect = elRef.value.getBoundingClientRect();
        const pos = calculateBorderRelativePosition(
            rect,
            side,
            { x: e.clientX, y: e.clientY }
        );

        emit(connectEvent, {
            id: model.id,
            type,
            border: side,
            position: pos
        });
    }


    function handlePointerDown (e) {
        emit(connectEvent);
    }

    return {
        handlePointerDown,

        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick
    };
}

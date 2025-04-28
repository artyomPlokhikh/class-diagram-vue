import { ref } from 'vue';
import { useHoverPreview } from '@/composables/useHoverPreview.js';
import { calculateBorderRelativePosition } from '@/utils/mathHelpers.js';

export function useConnectable(model, elRef, emit, connectEvent, type) {
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
        // always select first
        emit(type + '-select');

        const rect = elRef.value.getBoundingClientRect();
        const pos = calculateBorderRelativePosition(
            rect,
            side,
            { x: e.clientX, y: e.clientY }
        );

        emit(connectEvent, {
            type,
            id: model.id,
            border: side,
            position: pos
        });
    }

    return {
        isHovering,
        onBorderHover,
        onBorderLeave,
        onBorderClick
    };
}

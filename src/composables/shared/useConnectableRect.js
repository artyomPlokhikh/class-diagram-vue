/**
 * Connectable Rectangle Behavior
 *
 * This composable makes rectangle-based elements (entities, notes, enumerations)
 * connectable with relationships. It enables border detection for relationship connections
 * and provides visual feedback during hover interactions.
 */
import { inject, ref } from 'vue';
import { calculateBorderRelativePosition } from '@/utils/mathHelpers.js';

export function useConnectableRect(model, elRef, emit, connectEvent, type) {
    const isHovering = ref(false);
    const hover = inject('hover');

    function onBorderHover(e, side) {
        isHovering.value = true;
        hover.handleEntityBorderHover(e, elRef.value, side);
    }

    function onBorderLeave() {
        isHovering.value = false;
        hover.clearPreview();
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

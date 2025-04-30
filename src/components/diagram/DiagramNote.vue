<template>
    <div
        ref="noteRef"
        class="diagram-rect diagram-note"
        :class="{ 'diagram-note--selected': isSelected, 'diagram-rect--selected': isSelected }"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handlePointerDown"
        @click.stop
    >
        <div class="diagram-note__content">
            {{ note.content }}
        </div>

        <div
            v-show="isSelected"
            class="diagram-rect__resize-handle"
            @mousedown.left.stop.prevent="startResizing($event)"
            @dblclick.stop.prevent="resetSize($event)"
        ></div>

        <div
            v-for="side in ['top', 'right', 'bottom', 'left']"
            :key="side"
            class="diagram-rect__border"
            :class="[`diagram-rect__border--${side}`, { 'diagram-rect__border--highlighted': isHovering }]"
            @mouseenter="isHovering = true"
            @mouseleave="onBorderLeave"
            @mousemove="onBorderHover($event, side)"
            @click.stop="onBorderClick($event, side)"
            @mousedown.stop
        ></div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Note from '@/models/Note.js';
import { useNote } from "@/composables/useNote.js";

const props = defineProps({
    note: { type: Object, required: true, validator: v => v instanceof Note },
    isSelected: { type: Boolean, default: false },
});
const emit = defineEmits(['note-select', 'relationship-connect']);

const noteRef = ref(null);

const {
    handlePointerDown,
    isHovering,
    onBorderHover,
    onBorderLeave,
    onBorderClick,
    isDragging,
    isResizing,
    startResizing,
    resetSize,
    isManuallyResized
} = useNote(props.note, noteRef, props.isSelected, emit);

const positionStyle = computed(() => ({
    transform: `translate(${props.note.x}px, ${props.note.y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const sizeStyle = computed(() => {
    if (isResizing.value || isManuallyResized.value) {
        return {
            width: props.note.width + 'px',
            height: props.note.height + 'px'
        };
    } else {
        return {
            minWidth: props.note.width + 'px',
            minHeight: props.note.height + 'px'
        };
    }
});
</script>
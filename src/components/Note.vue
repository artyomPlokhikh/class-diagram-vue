<template>
    <div
        ref="noteRef"
        class="note"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handleMouseDown"
        @click.stop
    >
        <div class="note-content">
            {{ note.content }}
        </div>

        <div
            v-show="isSelected"
            class="resize-handle"
            @mousedown.left.stop.prevent="mr.startResizing($event)"
            @dblclick.stop.prevent="mr.resetSize($event)"
        ></div>

        <div
            v-for="side in ['top', 'right', 'bottom', 'left']"
            :key="side"
            class="note-border"
            :class="[side + '-border', { 'highlight-border': sc.isHovering }]"
            @mouseenter="sc.isHovering = true"
            @mouseleave="sc.onBorderLeave"
            @mousemove="sc.onBorderHover($event, side)"
            @click.stop="sc.onBorderClick($event, side)"
            @mousedown.stop
        ></div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Note from '@/models/Note.js';
import { useMovableResizable } from "@/composables/shared/useMovableResizable.js";
import { useSelectableConnectable } from "@/composables/shared/useSelectableConnectable.js";

const props = defineProps({
    note: { type: Object, required: true, validator: v => v instanceof Note },
    isSelected: { type: Boolean, default: false },
});
const emit = defineEmits(['note-select', 'relationship-connect']);

const noteRef = ref(null);
const mr = useMovableResizable(props.note, noteRef, { measureIntrinsic: true });
const sc = useSelectableConnectable(
    props.note,
    noteRef,
    props.isSelected,
    emit,
    { selectEvent: 'note-select', connectEvent: 'relationship-connect', type: 'note' }
);

const handleMouseDown = e => {
    sc.onPointerDown(e);
    mr.startDragging(e);
};

const positionStyle = computed(() => ({
    transform: `translate(${props.note.x}px, ${props.note.y}px)`,
    transition: mr.isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const sizeStyle = computed(() => {
    if (mr.isResizing.value || mr.isManuallyResized.value) {
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
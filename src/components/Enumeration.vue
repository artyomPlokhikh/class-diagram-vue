<template>
    <div
        ref="enumerationRef"
        class="enumeration"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handlePointerDown"
        @click.stop
    >
        <div class="enumeration__header">
            <span class="enumeration__annotation">
                «enumeration»
            </span>
            <span class="enumeration__name">{{ enumeration.name }}</span>
        </div>
        <ul class="enumeration__list">
            <li
                v-for="value in enumeration.values"
                :key="value.id"
                class="enumeration__item"
            >
                <span class="">{{ value.name }}</span>
            </li>
        </ul>
        <div
            v-show="isSelected"
            class="resize-handle"
            @mousedown.left.stop.prevent="startResizing($event)"
            @dblclick.stop.prevent="resetSize($event)"
        ></div>

        <div
            v-for="side in ['top', 'right', 'bottom', 'left']"
            :key="side"
            class="enumeration__border"
            :class="[side + '-border', { 'highlight-border': isHovering }]"
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
import Enumeration from '@/models/Enumeration.js';
import { useEnumeration } from '@/composables/useEnumeration.js';


const props = defineProps({
    enumeration: { type: Object, required: true, validator: v => v instanceof Enumeration },
    isSelected: { type: Boolean, default: false },
});
const emit = defineEmits(['enumeration-select', 'relationship-connect']);

const enumerationRef = ref(null);

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
    isManuallyResized,
} = useEnumeration(props.enumeration, enumerationRef, props.isSelected, emit);


const positionStyle = computed(() => ({
    transform: `translate(${props.enumeration.x}px, ${props.enumeration.y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4,0,0.2,1)'
}));

const sizeStyle = computed(() => {
    if (isResizing.value || isManuallyResized.value) {
        return { width: props.enumeration.width + 'px', height: props.enumeration.height + 'px' };
    }
    return { minWidth: props.enumeration.width + 'px', minHeight: props.enumeration.height + 'px' };
});
</script>`
<template>
    <div
        ref="enumerationRef"
        class="diagram-rect diagram-enumeration"
        :class="{
            'diagram-rect--selected': isSelected,
            'diagram-rect--empty': isEmpty
        }"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handlePointerDown"
        @click.stop
    >
        <header class="diagram-enumeration__header">
            <span class="diagram-enumeration__annotation">
                «enumeration»
            </span>
            <span class="diagram-enumeration__name">{{ enumeration.name }}</span>
        </header>

        <div class="diagram-rect__section">
            <ul class="diagram-enumeration__value-list">
                <li
                    v-for="value in enumeration.values"
                    :key="value.id"
                    class="diagram-enumeration__value-item"
                >
                    <span class="">{{ value }}</span>
                </li>
            </ul>
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
import { computed, ref } from 'vue';
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


const isEmpty = computed(() => {
        if (!props.enumeration) return false;
        return props.enumeration.values.length === 0;
    }
);

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
</script>
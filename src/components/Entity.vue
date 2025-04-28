<template>
    <div
        ref="entityRef"
        class="entity"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handlePointerDown"
        @click.stop
    >
        <div class="entity-header">
            <span v-if="entity.annotation" class="entity-annotation">
                «{{ entity.annotation }}»
            </span>
            <span class="entity-name">{{ entity.name }}</span>
        </div>
        <ul class="attributes-list">
            <li
                v-for="attr in entity.attributes"
                :key="attr.id"
                class="attribute-item"
            >
                <span class="attribute-visibility">{{ attr.visibility.literal }}</span>
                <span class="attribute-name">{{ attr.name }}</span>
                <span class="attribute-type">{{ attr.type.name }}</span>
            </li>
        </ul>
        <hr>
        <ul class="methods-list">
            <li
                v-for="method in entity.methods"
                :key="method.id"
                class="method-item"
            >
                <span class="method-visibility">{{ method.visibility.literal }}</span>
                <span class="method-name">{{ method.name }}(): </span>
                <span class="method-type">{{ method.type.name }}</span>
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
            class="entity-border"
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
import Entity from '@/models/Entity.js';
import { useEntity } from "@/composables/useEntity.js";

const props = defineProps({
    entity: { type: Object, required: true, validator: v => v instanceof Entity },
    isSelected: { type: Boolean, default: false },
});
const emit = defineEmits(['entity-select', 'relationship-connect']);

const entityRef = ref(null);

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
} = useEntity(props.entity, entityRef, props.isSelected, emit);


const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4,0,0.2,1)'
}));

const sizeStyle = computed(() => {
    if (isResizing.value || isManuallyResized.value) {
        return { width: props.entity.width + 'px', height: props.entity.height + 'px' };
    }
    return { minWidth: props.entity.width + 'px', minHeight: props.entity.height + 'px' };
});

</script>



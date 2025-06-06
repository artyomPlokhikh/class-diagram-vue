<template>
    <div
        ref="entityRef"
        class="diagram-rect diagram-entity"
        :class="{
            'diagram-rect--selected': isSelected,
            'diagram-rect--empty': isEmpty
        }"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handlePointerDown"
        @touchend.prevent="handlePointerDown"
        @click.stop
    >
        <header class="diagram-entity__header">
            <span v-if="entity.annotation" class="diagram-entity__annotation">
                «{{ entity.annotation }}»
            </span>
            <span class="diagram-entity__name">{{ entity.name }}</span>
        </header>
        <div class="diagram-rect__section">
            <ul class="diagram-entity__attribute-list">
                <li
                    v-for="attr in entity.attributes"
                    :key="attr.id"
                    class="diagram-entity__attribute-item"
                >
                    <span class="diagram-entity__visibility">{{ attr.visibility.literal }}</span>
                    <span class="diagram-entity__item-name">{{ attr.name }}</span>
                    <span class="diagram-entity__item-type">{{ attr.type.name }}</span>
                </li>
            </ul>
        </div>

        <div
            class="diagram-rect__section"
            :class="{ 'diagram-rect__section--with-divider': entity.attributes.length > 0 && entity.methods.length > 0 }"
        >
            <ul class="diagram-entity__method-list">
                <li
                    v-for="method in entity.methods"
                    :key="method.id"
                    class="diagram-entity__method-item"
                >
                    <span class="diagram-entity__visibility">{{ method.visibility.literal }}</span>
                    <span class="diagram-entity__item-name">{{ method.name }}() </span>
                    <span class="diagram-entity__item-type">{{ method.type.name }}</span>
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


const isEmpty = computed(() => {
        if (!props.entity) return false;
        return props.entity.attributes.length === 0 && props.entity.methods.length === 0;
    }
);

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

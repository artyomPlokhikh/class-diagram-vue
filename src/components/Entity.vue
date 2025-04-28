<template>
    <div
        ref="entityRef"
        class="entity"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="handleMouseDown"
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
            @mousedown.left.stop.prevent="mr.startResizing($event)"
            @dblclick.stop.prevent="mr.resetSize($event)"
        ></div>

        <div
            v-for="side in ['top', 'right', 'bottom', 'left']"
            :key="side"
            class="entity-border"
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
import Entity from '@/models/Entity.js';
import { useMovableResizable } from '@/composables/shared/useMovableResizable.js';
import { useSelectableConnectable } from '@/composables/shared/useSelectableConnectable.js';

const props = defineProps({
    entity: { type: Object, required: true, validator: v => v instanceof Entity },
    isSelected: { type: Boolean, default: false },
});
const emit = defineEmits(['entity-select', 'relationship-connect']);

const entityRef = ref(null);
const mr = useMovableResizable(props.entity, entityRef, { measureIntrinsic: true });
const sc = useSelectableConnectable(
    props.entity,
    entityRef,
    props.isSelected,
    emit,
    { selectEvent: 'entity-select', connectEvent: 'relationship-connect', type: 'entity' }
);

const handleMouseDown = e => {
    sc.onPointerDown(e);
    mr.startDragging(e);
};

const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: mr.isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4,0,0.2,1)'
}));

const sizeStyle = computed(() => {
    if (mr.isResizing.value || mr.isManuallyResized.value) {
        return { width: props.entity.width + 'px', height: props.entity.height + 'px' };
    }
    return { minWidth: props.entity.width + 'px', minHeight: props.entity.height + 'px' };
});
</script>



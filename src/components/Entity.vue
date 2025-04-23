<template>
    <div
        ref="entityRef"
        class="entity"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="onMouseDown"
        @mousedown.right="onRightClick"
        @click.stop
    >
        <div class="entity-header">
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
            class="resize-handle"
            @mousedown.left.stop.prevent="composable.startResizing($event)"
            @dblclick.stop.prevent="composable.resetSize($event)"
        ></div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useEntity } from '@/composables/useEntity.js';
import Entity from "@/models/Entity.js";

const props = defineProps({
    entity: {
        type: Object,
        required: true,
        validator: v => v instanceof Entity,
    }
});
const emit = defineEmits(['entity-select', 'relationship-connect']);

const entityRef = ref(null);
const composable = useEntity(props.entity, entityRef);

const onMouseDown = (e) => {
    emit('entity-select');
    composable.startDragging(e);
};

const onRightClick = () => {
    emit('relationship-connect');
};

const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: composable.isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const sizeStyle = computed(() => {
    if (composable.isResizing.value || composable.isManuallyResized.value) {
        return {
            width: props.entity.width + 'px',
            height: props.entity.height + 'px'
        };
    } else {
        return {
            minWidth: props.entity.width + 'px',
            minHeight: props.entity.height + 'px'
        };
    }
});
</script>
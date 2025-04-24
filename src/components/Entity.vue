<template>
    <div
        ref="entityRef"
        class="entity"
        :style="[positionStyle, sizeStyle]"
        @mousedown.left="onMouseDown"
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
            v-if="entitySelected"
            class="resize-handle"
            @mousedown.left.stop.prevent="composable.startResizing($event)"
            @dblclick.stop.prevent="composable.resetSize($event)"
        ></div>

        <div
            class="entity-border top-border"
            :class="{ 'highlight-border': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click.stop="handleBorderClick($event, 'top')"
            @mousedown.stop
        ></div>
        <div
            class="entity-border right-border"
            :class="{ 'highlight-border': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click.stop="handleBorderClick($event, 'right')"
            @mousedown.stop
        ></div>
        <div
            class="entity-border bottom-border"
            :class="{ 'highlight-border': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click.stop="handleBorderClick($event, 'bottom')"
            @mousedown.stop
        ></div>
        <div
            class="entity-border left-border"
            :class="{ 'highlight-border': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click.stop="handleBorderClick($event, 'left')"
            @mousedown.stop
        ></div>
    </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useEntity } from '@/composables/useEntity.js';
import Entity from "@/models/Entity.js";
import { calculateBorderRelativePosition } from "@/utils/mathHelpers.js";

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

const selectedObj = inject("selectedObj", computed(() => null));
const isHovering = ref(false);


const onMouseDown = (e) => {
    emit('entity-select');
    composable.startDragging(e);
};

const handleBorderClick = (event, borderSide) => {
    emit('entity-select');

    const position = calculateBorderRelativePosition(
        entityRef.value.getBoundingClientRect(),
        borderSide,
        { x: event.clientX, y: event.clientY }
    );

    emit('relationship-connect', {
        entityId: props.entity.id,
        border: borderSide,
        position,
    });
};

const entitySelected = computed(() => {
    return selectedObj.value && selectedObj.value.id === props.entity.id;
});

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

<style scoped>
.entity {
    position: absolute;
    background-color: white;
    border: 1px solid #333;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    overflow: visible;
}

.entity-border {
    position: absolute;
    background-color: transparent;
    z-index: 5;
}

.top-border {
    top: -5px;
    left: 0;
    width: 100%;
    height: 10px;
    cursor: crosshair;
}

.right-border {
    top: 0;
    right: -5px;
    width: 10px;
    height: 100%;
    cursor: crosshair;
}

.bottom-border {
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 10px;
    cursor: crosshair;
}

.left-border {
    top: 0;
    left: -5px;
    width: 10px;
    height: 100%;
    cursor: crosshair;
}

.highlight-border {
    background-color: rgba(0, 255, 0, 0.2);
}

</style>
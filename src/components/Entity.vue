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
            <input
                v-model="entity.name"
                class="entity-name"
                :readonly="!composable.editing"
                @dblclick.stop="composable.enableEditing"
                @blur="composable.disableEditing"
            />
            <button class="btn-danger" @click.stop="onEntityDelete">×</button>
        </div>
        <ul class="attributes-list">
            <li
                v-for="(attr, index) in entity.attributes"
                :key="index"
                class="attribute-item"
            >
                <span class="attribute-name">{{ attr.name }}</span>
                <span class="attribute-type">{{ attr.type }}</span>
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
import {computed, ref} from 'vue'
import {useEntity} from '@/composables/useEntity.js'

const props = defineProps({
    entity: Object
})
const emit = defineEmits(['entity-select', 'entity-delete', 'relationship-connect'])

const entityRef = ref(null)
const composable = useEntity(props.entity, entityRef)

const onMouseDown = (e) => {
    emit('entity-select')
    composable.startDragging(e)
}
const onEntityDelete = () => {
    if (confirm(`Delete entity "${props.entity.name}"?`)) {
        emit('entity-delete')
    }
}
const onRightClick = () => {
    emit('relationship-connect')
}

const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: composable.isDragging.value
        ? 'none'
        : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}))

const sizeStyle = computed(() => {
    if (composable.isResizing.value || composable.isManuallyResized.value) {
        return {
            width: props.entity.width + 'px',
            height: props.entity.height + 'px'
        }
    } else {
        return {
            minWidth: props.entity.width + 'px',
            minHeight: props.entity.height + 'px'
        }
    }
})
</script>

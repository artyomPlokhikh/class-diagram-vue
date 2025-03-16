<template>
    <div
        class="entity"
        :style="positionStyle"
        @mousedown.left="onMouseDown"
    >
        <div class="entity-header">
            <input
                ref="entityInput"
                v-model="entity.name"
                class="entity-name"
                :readonly="!editing"
                @dblclick.stop="enableEditing"
                @blur="disableEditing"
                @click.stop
            />
            <button class="btn-danger" @click.stop="onEntityDelete">×</button>
        </div>
        <ul class="attributes-list">
            <li v-for="(attr, index) in entity.attributes" :key="index" class="attribute-item">
                <span class="attribute-name">{{ attr.name }}</span>
                <span class="attribute-type">{{ attr.type }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {computed, toRef} from 'vue'
import {useEntity} from '@/composables/useEntity.js'

const props = defineProps({
    entity: Object,
    zoom: Number,
})
const emit = defineEmits(['entity-select', 'entity-delete'])

const {
    editing,
    entityInput,
    enableEditing,
    disableEditing,
    isDragging,
    startDragging
} = useEntity(props.entity, toRef(props, 'zoom'))

const positionStyle = computed(() => ({
    transform: `translate(${props.entity.x}px, ${props.entity.y}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}))

const onMouseDown = (e) => {
    emit('entity-select')
    startDragging(e)
}
const onEntityDelete = () => {
    if (confirm(`Delete entity "${props.entity.name}"?`)) {
        emit('entity-delete')
    }
}
</script>
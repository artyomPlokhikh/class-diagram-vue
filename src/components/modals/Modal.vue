<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="modal__overlay"
            @click="closeOnOverlayClick && $emit('close')"
        >
            <div class="modal__container" :class="containerClass" @click.stop>
                <header class="modal__header">
                    <h3 class="modal__title">{{ title }}</h3>
                    <button class="modal__close-button" @click="$emit('close')" aria-label="Close modal">&times;
                    </button>
                </header>
                <div class="modal__content">
                    <slot name="content"></slot>
                </div>
                <div class="modal__footer">
                    <slot name="footer">
                        <button class="button" @click="$emit('close')">Close</button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Modal'
    },
    closeOnOverlayClick: {
        type: Boolean,
        default: true
    },
    containerClass: {
        type: String,
        default: ''
    }
});

defineEmits(['close']);
</script>

<template>
    <Modal
        :isOpen="isOpen"
        title="Help"
        :closeOnOverlayClick="false"
        :containerClass="'modal__container--big'"
        @close="$emit('close')"
    >
        <template #content>
            <div class="help-modal__layout">
                <nav class="help-modal__nav">
                    <div
                        v-for="section in sections"
                        :key="section.id"
                        class="help-modal__nav-item"
                        :class="{ 'help-modal__nav-item--active': activeSection === section.id }"
                        @click="activeSection = section.id"
                    >
                        {{ section.title }}
                    </div>
                </nav>

                <section class="help-modal__content">
                    <div v-if="activeSection === 'shortcuts'" class="help-section">
                        <h3>Keyboard Shortcuts</h3>
                        <div class="help-modal__info">
                            <p>Use these keyboard shortcuts to work more efficiently:</p>
                            <ul>
                                <li><i>Ctrl</i> + <i>Z</i> / <i>Cmd</i> + <i>Z</i> – Undo last action</li>
                                <li><i>Ctrl</i> + <i>Y</i> / <i>Cmd</i> + <i>Y</i> – Redo last action</li>
                                <li><i>Ctrl</i> + <i>S</i> / <i>Cmd</i> + <i>S</i> – Save diagram</li>
                                <li><i>Shift</i> + drag – Constrain movement to perfect vertical / horizontal alignment
                                </li>
                                <li><i>Ctrl</i> + drag – Precision movement by temporarily disabling snapping</li>
                                <li><i>Esc</i> – Cancel current action</li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="activeSection === 'creation'" class="help-section">
                        <h3>Creating Class Objects</h3>
                        <div class="help-content-layout">
                            <div class="help-modal__video-container">
                                <video autoplay loop muted playsinline>
                                    <source :src="getVideoUrl('objects')" type="video/mp4"/>
                                </video>
                            </div>
                            <div class="help-modal__info">
                                <p>Follow these steps to create and manage class objects in your diagram:</p>
                                <ol>
                                    <li>Choose the object type from the left palette panel.</li>
                                    <li>Either click directly on it or drag to your preferred position on canvas.</li>
                                    <li>Use the properties panel on the right to customise attributes, methods and other
                                        properties.
                                    </li>
                                    <li>
                                        To move objects with precision:
                                        <ul>
                                            <li>Hold <i>Shift</i> while dragging to constrain movement to perfect
                                                horizontal or vertical paths.
                                            </li>
                                            <li>Hold <i>Ctrl</i> while dragging to temporarily disable grid snapping for
                                                precise positioning.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>Resize objects using the handles at the corners and edges, or double-click a
                                        handle to reset to the default size.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeSection === 'relationships'" class="help-section">
                        <h3>Creating Relationships</h3>
                        <div class="help-content-layout">
                            <div class="help-modal__video-container">
                                <video autoplay loop muted playsinline>
                                    <source :src="getVideoUrl('relationships')" type="video/mp4"/>
                                </video>
                            </div>
                            <div class="help-modal__info">
                                <p>Create and customise relationships between your classes:</p>
                                <ol>
                                    <li>Left-click on the border of your source object to initiate a connection.</li>
                                    <li>Left-click on the border of the target object to complete the connection.</li>
                                    <li>
                                        During creation or editing:
                                        <ul>
                                            <li>Left-click on empty space to add bend points for custom routing.</li>
                                            <li>Right-click to remove the most recently added bend point.</li>
                                        </ul>
                                    </li>
                                    <li>For existing relationships, right-click anywhere on the line to add a bend
                                        point, then drag it to adjust the path.
                                    </li>
                                    <li>
                                        When moving bend points:
                                        <ul>
                                            <li>Hold <i>Shift</i> to constrain movement to horizontal or vertical
                                                directions.
                                            </li>
                                            <li>Hold <i>Ctrl</i> to disable snapping for fine-tuned positioning.</li>
                                        </ul>
                                    </li>
                                    <li>Use the properties panel to change relationship type, labels and styling.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </template>
    </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/modals/Modal.vue'

const props = defineProps({ isOpen: { type: Boolean, default: false } })
defineEmits(['close'])

const sections = [
    { id: 'shortcuts', title: 'Keyboard Shortcuts' },
    { id: 'creation', title: 'Objects creation' },
    { id: 'relationships', title: 'Relationships' }
]

const activeSection = ref('shortcuts')

watch(
    () => props.isOpen,
    open => {
        if (open) activeSection.value = 'shortcuts'
    }
)

const getVideoUrl = name => `${import.meta.env.BASE_URL}videos/${name}.mp4`;
</script>

<style scoped>
.help-modal :deep(.modal__container) {
    width: 80vw;
    max-width: 1000px;
    height: 80vh;
    max-height: 800px;
}

.help-modal__layout {
    display: flex;
    height: 100%;
    overflow: hidden;
}

.help-modal__nav {
    width: 200px;
    flex: 0 0 200px;
    border-right: 1px solid #ddd;
    background: #f5f5f5;
    padding: 16px 0;
    box-sizing: border-box;
}

@media (min-width: 768px) {
    .help-modal__nav {
        position: sticky;
        top: 0;
        max-height: 80vh;
        overflow-y: auto;
    }
}

.help-modal__nav-item {
    margin: 0 8px 8px;
    padding: 12px 16px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color .2s;
}

.help-modal__nav-item:hover {
    background: #e8e8e8;
}

.help-modal__nav-item--active {
    background: #2c3e50;
    color: #fff;
}

.help-modal__content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 16px 24px;
    -webkit-overflow-scrolling: touch;
}

.help-section {
    margin: 0;
}

.help-content-layout {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 20px;
    align-items: flex-start;
}

@media (min-width: 768px) {
    .help-content-layout {
        flex-direction: row;
        align-items: flex-start;
    }

    .help-modal__video-container {
        order: 2;
    }

    .help-modal__info {
        order: 1;
    }
}

.help-modal__video-container {
    aspect-ratio: 1/1;
    width: clamp(160px, 35vw, 320px);
    flex: 0 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
}

@media (max-width: 767px) {
    .help-modal__video-container {
        width: 100%;
        max-width: 360px;
        margin: 0 auto;
    }
}

.help-modal__video-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
}

.help-modal__info {
    flex: 1 1 auto;
}

h3 {
    margin: 0 0 8px;
    font-size: 1.6rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}

h4 {
    margin: 24px 0 12px;
}

ul, ol {
    padding-left: 24px;
}

li {
    margin-bottom: 16px;
    line-height: 1.5;
}

p {
    margin-bottom: 16px;
    line-height: 1.5;
}

i {
    font-style: normal;
    font-weight: 400;
    padding: 4px;
    background: #f7f7f7;
    border: 1px solid #bfbfbf;
}
</style>

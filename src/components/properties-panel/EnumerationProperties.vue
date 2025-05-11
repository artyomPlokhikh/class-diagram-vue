<template>
    <div class="properties">
        <header class="properties__header">
            <h3 class="properties__title">Enum Properties</h3>
            <button
                class="properties__delete-btn"
                @click="diagramStore.deleteEnumeration(enumeration.id)"
                title="Delete Enum"
            >
                Delete
            </button>
        </header>

        <div class="properties__group">
            <label class="properties__label" for="enum-name">Enum Name:</label>
            <input
                id="enum-name"
                v-model.trim="enumeration.name"
                class="properties__input"
                placeholder="e.g., Status"
                autofocus
            />
        </div>

        <div class="properties__group">
            <label class="properties__label">Values:</label>

            <div class="properties-list">
                <div
                    v-for="(val, index) in enumeration.values"
                    :key="index"
                    class="properties-list__item"
                >
                    <input
                        v-model.trim="enumeration.values[index]"
                        class="properties-list__input"
                        placeholder="New Value"
                    />
                    <button
                        class="properties-list__remove"
                        @click="removeValue(index)"
                    >
                        ×
                    </button>
                </div>
            </div>
            <button class="button properties-list__add" @click="addValue">
                + Add Value
            </button>
        </div>
    </div>
</template>

<script setup>
import { useDiagramStore } from "@/stores/diagram.js";
import { computed, watch } from "vue";
import { debounce } from "@/utils/debounce.js";

const diagramStore = useDiagramStore();
const enumeration = computed(() => diagramStore.selected);

const saveEnumeration = debounce(() => {
    if (enumeration.value) diagramStore.save();
}, 1000);

function removeValue(index) {
    enumeration.value.values.splice(index, 1);
    saveEnumeration();
}

function addValue() {
    enumeration.value.values.push("New Value");
    saveEnumeration();
}

watch(() => enumeration.value?.name, saveEnumeration);
watch(() => enumeration.value?.values, saveEnumeration, { deep: true });
</script>
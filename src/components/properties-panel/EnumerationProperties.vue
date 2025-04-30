<template>
    <div class="properties">
        <h3 class="properties__title">Enum Properties</h3>

        <div class="properties__group">
            <label class="properties__label">Enum Name:</label>
            <input v-model="enumeration.name" class="properties__input"/>
        </div>

        <div class="properties__group">
            <label class="properties__label">Values:</label>
            <div class="properties__list">
                <div v-for="val in enumeration.values" class="properties__item">
                    <input v-model="val.name" class="properties__input"/>
                </div>
            </div>
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
}, 2000);

watch(() => enumeration.value?.name, saveEnumeration);

</script>
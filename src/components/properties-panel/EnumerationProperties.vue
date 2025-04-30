<template>
    <div class="properties-panel">
        <h3>Enum Properties</h3>
        <div class="form-group">
            <label>Enum Name:</label>
            <input v-model="enumeration.name" class="enum-name-input"/>
        </div>
        <div class="form-group">
            <label>Values:</label>
            <div class="values-list">
                <div v-for="(val) in enumeration.values" class="value-item">
                    <input v-model="val.name" class="value-name-input"/>
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
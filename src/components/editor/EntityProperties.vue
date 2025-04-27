<template>
    <div class="properties-panel">
        <h3>Entity Properties</h3>
        <div class="form-group">
            <label>Entity Name:</label>
            <input v-model="entity.name" class="entity-name-input"/>
        </div>
        <h4>Attributes</h4>
        <AttributeList
            :attributes="entity.attributes"
            @add-attribute="() => store.addAttribute()"
            @remove-attribute="(id) => store.removeAttribute(id)"
        />
        <h4>Methods</h4>
        <MethodList
            :methods="entity.methods"
            @add-method="() => store.addMethod()"
            @remove-method="(id) => store.removeMethod(id)"
        />
    </div>
</template>

<script setup>
import { computed, inject, watch } from 'vue';
import AttributeList from '@/components/editor/AttributeList.vue';
import MethodList from '@/components/editor/MethodList.vue';
import { debounce } from "@/utils/debounce.js";

const store = inject("diagramStore");
const entity = computed(() => store.selected);

const saveEntity = debounce(() => {
    if (entity.value) {
        store.save();
    }
}, 2000);

watch(() => entity.value?.name, saveEntity);

</script>

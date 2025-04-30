<template>
    <div class="properties">
        <h3 class="properties__title">Entity Properties</h3>

        <div class="properties__group">
            <label class="properties__label">Entity Name:</label>
            <input v-model="entity.name" class="properties__input" />
        </div>

        <div class="properties__group">
            <label class="properties__label">Annotation:</label>
            <AnnotationList v-model:annotation="entity.annotation" />
        </div>

        <div class="properties__group">
            <label class="properties__label">Attributes:</label>
            <AttributeList
                :attributes="entity.attributes"
                @add-attribute="diagramStore.addAttribute(entity.id)"
                @remove-attribute="id => diagramStore.removeAttribute(entity.id, id)"
            />
        </div>

        <div class="properties__group">
            <label class="properties__label">Methods:</label>
            <MethodList
                :methods="entity.methods"
                @add-method="diagramStore.addMethod(entity.id)"
                @remove-method="id => diagramStore.removeMethod(entity.id, id)"
            />
        </div>
    </div>
</template>


<script setup>
import { computed, watch } from 'vue';
import AttributeList from '@/components/properties-panel/AttributeList.vue';
import MethodList from '@/components/properties-panel/MethodList.vue';
import { debounce } from "@/utils/debounce.js";
import AnnotationList from "@/components/properties-panel/AnnotationList.vue";
import { useDiagramStore } from "@/stores/diagram.js";

const diagramStore = useDiagramStore();
const entity = computed(() => diagramStore.selected);

const saveEntity = debounce(() => {
    if (entity.value) diagramStore.save();
}, 2000);

watch(() => entity.value?.name, saveEntity);

</script>

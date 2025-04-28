<template>
    <div class="properties-panel">
        <h3>Entity Properties</h3>
        <div class="form-group">
            <label>Entity Name:</label>
            <input v-model="entity.name" class="entity-name-input"/>
        </div>
        <div class="form-group">
            <label>Annotation:</label>
            <AnnotationList
                v-model:annotation="entity.annotation"
            />
        </div>
        <h4>Attributes</h4>
        <AttributeList
            :attributes="entity.attributes"
            @add-attribute="diagramStore.addAttribute(entity.id)"
            @remove-attribute="(id) => diagramStore.removeAttribute(entity.id, id)"
        />
        <h4>Methods</h4>
        <MethodList
            :methods="entity.methods"
            @add-method="diagramStore.addMethod(entity.id)"
            @remove-method="(id) => diagramStore.removeMethod(entity.id, id)"
        />
    </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import AttributeList from '@/components/editor/AttributeList.vue';
import MethodList from '@/components/editor/MethodList.vue';
import { debounce } from "@/utils/debounce.js";
import AnnotationList from "@/components/editor/AnnotationList.vue";
import { useDiagramStore } from "@/stores/diagram.js";

const diagramStore = useDiagramStore();
const entity = computed(() => diagramStore.selected);

const saveEntity = debounce(() => {
    if (entity.value) {
        diagramStore.save();
    }
}, 2000);

watch(() => entity.value?.name, saveEntity);

</script>

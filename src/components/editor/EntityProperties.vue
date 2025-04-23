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
            @add-attribute="() => entity.addAttribute()"
            @remove-attribute="(id) => entity.removeAttribute(id)"
        />
        <h4>Methods</h4>
        <MethodList
            :methods="entity.methods"
            @add-method="() => entity.addMethod()"
            @remove-method="(id) => entity.removeMethod(id)"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDiagramStore } from '@/stores/diagram';
import AttributeList from '@/components/editor/AttributeList.vue';
import MethodList from '@/components/editor/MethodList.vue';

const store = useDiagramStore();
const entity = computed(() => store.selected);

</script>

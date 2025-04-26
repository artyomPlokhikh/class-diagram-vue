<template>
    <svg
        v-if="hasGuides"
        class="snap-guides"
        width=""
        height=""
        pointer-events="none"
        style="position:absolute; top:0; left:0; z-index:500"
    >
        <line
            v-for="(s,i) in snapping.guides.vSegments"
            :key="'v'+i"
            :x1="s.x" :x2="s.x"
            :y1="s.y1" :y2="s.y2"
            class="snap-line"
        />
        <line
            v-for="(s,i) in snapping.guides.hSegments"
            :key="'h'+i"
            :x1="s.x1" :x2="s.x2"
            :y1="s.y"  :y2="s.y"
            class="snap-line"
        />
    </svg>
</template>

<script setup>
import { computed, inject } from 'vue';

const snapping = inject('snapping');

const hasGuides = computed(() =>
    snapping.guides.vSegments.length > 0 || snapping.guides.hSegments.length > 0
);
</script>

<style scoped>
.snap-line {
    stroke: rgba(50,150,250,0.5);
    stroke-width: 1;
}
</style>

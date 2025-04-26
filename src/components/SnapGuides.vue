<template>
    <svg
        v-if="snappingGuides.length"
        class="relationship-svg"
    >
        <g class="relationship">
            <line
                v-for="(s, i) in snappingGuides"
                :key="i"
                :x1="s.x1" :y1="s.y1"
                :x2="s.x2" :y2="s.y2"
                class="snap-line"
            />
        </g>
    </svg>
</template>

<script setup>
import { inject, computed } from 'vue';

const snapping = inject('snapping');
const snappingGuides = computed(() => {
    return snapping.guides.segments.map(s => {
        const dx = s.x2 - s.x1;
        const dy = s.y2 - s.y1;
        return {
            x1: s.x1 - dx * 100,
            y1: s.y1 - dy * 100,
            x2: s.x2 + dx * 100,
            y2: s.y2 + dy * 100
        };
    });
});
</script>

<style scoped>
.snap-line {
    stroke: rgb(0, 120, 255);
    stroke-width: 1.5;
    stroke-dasharray: 4, 3;
    filter: drop-shadow(0 0 2px rgba(0, 120, 255, 0.7));
    width: 100%;
    height: 100%;
    overflow: visible;
}
</style>
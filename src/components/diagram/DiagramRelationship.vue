<template>
    <g class="diagram-relationship" @click.stop="emit('relationship-select')">
        <polyline
            class="diagram-relationship__hit-area"
            :points="path"
            @contextmenu.prevent="addBendPoint"
            @mousemove="hover.handleRelationshipHover($event, allPoints)"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false; hover.clearPreview()"
        />
        <polyline
            class="diagram-relationship__line"
            :points="path"
            :stroke-dasharray="strokeDasharray"
            :marker-start="markerStart"
            :marker-end="markerEnd"
        />

        <text
            :x="labelPos.x"
            :y="labelPos.y - 5"
            text-anchor="middle"
            class="diagram-relationship__label"
        >
            {{ relationship.name }}
        </text>
        <text
            :x="srcMultPos.x"
            :y="srcMultPos.y"
            text-anchor="middle"
            class="diagram-relationship__multiplicity"
        >
            {{ relationship.src?.mult }}
        </text>
        <text
            :x="trgMultPos.x"
            :y="trgMultPos.y"
            text-anchor="middle"
            class="diagram-relationship__multiplicity"
        >
            {{ relationship.trg?.mult }}
        </text>
    </g>

    <teleport to="#relationship-handles-svg">
        <g
            v-show="isSelected || isHovering"
            class="diagram-relationship__handles"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
        >
            <template v-for="(pt, idx) in relationship.bendPoints" :key="idx">
                <circle
                    class="diagram-relationship__handle diagram-relationship__handle--interaction"
                    :cx="pt.x" :cy="pt.y" r="10"
                    @contextmenu.prevent="removeBendPoint(idx)"
                    @mousedown.stop.prevent="e => emit('bend-drag', relationship, idx, e)"
                />
                <circle
                    class="diagram-relationship__handle diagram-relationship__handle--bend"
                    :cx="pt.x" :cy="pt.y" r="5"
                    @contextmenu.prevent="removeBendPoint(idx)"
                    @mousedown.stop.prevent="e => emit('bend-drag', relationship, idx, e)"
                />
            </template>

            <circle
                class="diagram-relationship__handle diagram-relationship__handle--interaction"
                :cx="srcPoint.x" :cy="srcPoint.y" r="12"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'src' })"
            />
            <circle
                class="diagram-relationship__handle diagram-relationship__handle--endpoint"
                :cx="srcPoint.x" :cy="srcPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'src' })"
            />

            <circle
                class="diagram-relationship__handle diagram-relationship__handle--interaction"
                :cx="trgPoint.x" :cy="trgPoint.y" r="12"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'trg' })"
            />
            <circle
                class="diagram-relationship__handle diagram-relationship__handle--endpoint"
                :cx="trgPoint.x" :cy="trgPoint.y" r="6"
                @mousedown.stop.prevent="emit('relationship-drag',{ relationship, handleType:'trg' })"
            />
        </g>
    </teleport>
</template>


<script setup>
import { useRelationship } from '@/composables/useRelationship';
import Relationship from '@/models/Relationship.js';
import { inject, ref } from "vue";

const props = defineProps({
    relationship: {
        type: Object,
        required: true,
        validator: v => v instanceof Relationship
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['relationship-select', 'relationship-drag', 'bend-drag']);

const isHovering = ref(false);
const hover = inject('hover');

const {
    path,
    srcPoint,
    trgPoint,
    allPoints,
    labelPos,
    srcMultPos,
    trgMultPos,
    markerStart,
    markerEnd,
    strokeDasharray,
    addBendPoint,
    removeBendPoint,
} = useRelationship(props.relationship);

</script>

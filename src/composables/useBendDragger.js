import { inject } from 'vue';

export function useBendDragger(diagramStore, canvasRef) {
    const zoom = inject('zoom', { value: 1 });
    const pan = inject('pan', { value: { x: 0, y: 0 } });

    let currentBend = null;

    const startBendDrag = (relationship, bendIndex) => {
        currentBend = { relationship, bendIndex };

        const handleMouseMove = (event) => {
            if (!currentBend || !canvasRef.value) return;

            const rect = canvasRef.value.getBoundingClientRect();
            const x = (event.clientX - rect.left - pan.value.x) / zoom.value;
            const y = (event.clientY - rect.top - pan.value.y) / zoom.value;

            currentBend.relationship.bendPoints[currentBend.bendIndex] = { x, y };
            diagramStore.updateRelationship(currentBend.relationship);
        };

        const handleMouseUp = () => {
            currentBend = null;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return {
        startBendDrag
    };
}
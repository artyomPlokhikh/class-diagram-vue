import { calculateOrthogonalPosition, getCanvasCoordinates } from "@/utils/mathHelpers.js";
import { inject, ref } from "vue";

export function useBendDragger(diagramStore, canvasRef, pan, zoom) {
    const shiftPressed = inject('shiftPressed', ref(false));
    let currentBend = null;
    let initialBendPoint = null;

    const startBendDrag = (relationship, bendIndex) => {
        diagramStore.setSelected(relationship);
        currentBend = { relationship, bendIndex };
        initialBendPoint = currentBend.relationship.bendPoints[currentBend.bendIndex];

        const handleMouseMove = (event) => {
            if (!currentBend || !canvasRef.value) return;

            const rawPos = getCanvasCoordinates(
                event,
                canvasRef.value,
                pan.value,
                zoom.value
            );
            currentBend.relationship.bendPoints[currentBend.bendIndex] = shiftPressed.value
                ? calculateOrthogonalPosition(rawPos, initialBendPoint)
                : rawPos;
            diagramStore.updateRelationship(currentBend.relationship);
        };

        const handleMouseUp = () => {
            currentBend = null;
            initialBendPoint = null;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                currentBend.relationship.bendPoints[currentBend.bendIndex] = initialBendPoint;
                currentBend = null;
                initialBendPoint = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('keydown', handleKeyDown);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('keydown', handleKeyDown);
    };


    return {
        startBendDrag
    };
}
import { getCanvasCoordinates } from "@/utils/mathHelpers.js";

export function useBendDragger(diagramStore, canvasRef, pan, zoom) {

    let currentBend = null;

    const startBendDrag = (relationship, bendIndex) => {
        diagramStore.setSelected(relationship);
        currentBend = { relationship, bendIndex };

        const handleMouseMove = (event) => {
            if (!currentBend || !canvasRef.value) return;

            currentBend.relationship.bendPoints[currentBend.bendIndex] = getCanvasCoordinates(
                event,
                canvasRef.value,
                pan.value,
                zoom.value
            );
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
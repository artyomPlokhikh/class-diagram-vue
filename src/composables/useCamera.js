import { ref, computed, onUnmounted } from 'vue';

export function useCamera(canvas) {
    const pan = ref({ x: 0, y: 0 });
    const zoom = ref(1);
    const isCanvasPanning = ref(false);
    const canvasPanStart = ref({ x: 0, y: 0 });
    let lastClientX = 0;
    let lastClientY = 0;
    let rafId = null;

    const canvasStyle = computed(() => ({
        transform: `translate3d(${pan.value.x}px, ${pan.value.y}px, 0) scale(${zoom.value})`, transformOrigin: '0 0',
    }));

    const handleCanvasMouseDown = (event) => {
        isCanvasPanning.value = true;
        canvasPanStart.value = { x: event.clientX, y: event.clientY };
        lastClientX = event.clientX;
        lastClientY = event.clientY;
        document.addEventListener('mousemove', handlePanMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        rafId = requestAnimationFrame(updatePan);
    };

    const handlePanMouseMove = (event) => {
        lastClientX = event.clientX;
        lastClientY = event.clientY;
    };

    const updatePan = () => {
        if (!isCanvasPanning.value) return;

        const dx = lastClientX - canvasPanStart.value.x;
        const dy = lastClientY - canvasPanStart.value.y;

        pan.value.x += dx;
        pan.value.y += dy;

        canvasPanStart.value.x = lastClientX;
        canvasPanStart.value.y = lastClientY;

        rafId = requestAnimationFrame(updatePan);
    };

    const onMouseUp = () => {
        if (isCanvasPanning.value) {
            isCanvasPanning.value = false;
            document.removeEventListener('mousemove', handlePanMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(rafId);
        }
    };

    const handleWheel = (event) => {
        const scaleFactor = 1.1;
        const oldZoom = zoom.value;
        const newZoom = Math.max(0.5, Math.min(3.0, oldZoom * (event.deltaY < 0 ? scaleFactor : 1 / scaleFactor)));

        const rect = canvas.value.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        pan.value.x = offsetX - (offsetX - pan.value.x) * (newZoom / oldZoom);
        pan.value.y = offsetY - (offsetY - pan.value.y) * (newZoom / oldZoom);
        zoom.value = newZoom;
    };

    onUnmounted(() => {
        document.removeEventListener('mousemove', handlePanMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        cancelAnimationFrame(rafId);
    });

    return { pan, zoom, canvasStyle, handleCanvasMouseDown, handleWheel, isCanvasPanning };
}
import { ref, computed, onUnmounted, onMounted, watch } from 'vue';
import { useCameraStore } from "@/stores/camera.js";

export function useCamera(canvas) {
    const cam = useCameraStore();
    const pan = ref({ x: 0, y: 0 });
    const zoom = ref(1);
    const isCanvasPanning = ref(false);
    const canvasPanStart = ref({ x: 0, y: 0 });
    let lastClientX = 0;
    let lastClientY = 0;
    let rafId = null;

    const canvasStyle = computed(() => ({
        transform: `translate3d(${pan.value.x}px, ${pan.value.y}px, 0) scale(${zoom.value})`,
        transformOrigin: '0 0',
    }));

    const setPan = (x, y) => {
        pan.value.x = x;
        pan.value.y = y;
    };

    const setZoom = (z) => {
        zoom.value = z;
    };

    const cameraInterface = {
        setPan,
        setZoom
    };

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

    let touchMoveHandler = null;
    let touchEndHandler = null;

    const handleCanvasTouchStart = (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();

            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;

            let lastX = startX;
            let lastY = startY;

            touchMoveHandler = (e) => {
                if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    const deltaX = touch.clientX - lastX;
                    const deltaY = touch.clientY - lastY;

                    pan.value.x += deltaX;
                    pan.value.y += deltaY;

                    lastX = touch.clientX;
                    lastY = touch.clientY;
                }
            };

            touchEndHandler = () => {
                document.removeEventListener('touchmove', touchMoveHandler, { passive: false });
                document.removeEventListener('touchend', touchEndHandler);
                touchMoveHandler = null;
                touchEndHandler = null;
            };

            document.addEventListener('touchmove', touchMoveHandler, { passive: false });
            document.addEventListener('touchend', touchEndHandler);
        }
    };

    onMounted(() => {
        cam.setContainer(canvas.value);
        cam.setCameraInterface(cameraInterface);

        if (cam.pan) {
            pan.value.x = cam.pan.x;
            pan.value.y = cam.pan.y;
        }
        if (cam.zoom) {
            zoom.value = cam.zoom;
        }
    });
    watch(pan, p => cam.setPan(p.x, p.y), { deep: true });
    watch(zoom, z => cam.setZoom(z));

    watch(() => cam.pan, p => {
        if (p && !isCanvasPanning.value) {
            pan.value.x = p.x;
            pan.value.y = p.y;
        }
    }, { deep: true });

    watch(() => cam.zoom, z => {
        if (z && !isCanvasPanning.value) {
            zoom.value = z;
        }
    });

    onUnmounted(() => {
        document.removeEventListener('mousemove', handlePanMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (touchMoveHandler) {
            document.removeEventListener('touchmove', touchMoveHandler, { passive: false });
        }
        if (touchEndHandler) {
            document.removeEventListener('touchend', touchEndHandler);
        }

        cancelAnimationFrame(rafId);
    });

    return {
        pan,
        zoom,
        canvasStyle,
        handleCanvasMouseDown,
        handleWheel,
        isCanvasPanning,
        handleCanvasTouchStart,
        setPan,
        setZoom,
    };
}

import domtoimage from 'dom-to-image';
import { ref } from "vue";
import { calculateDiagramBounds } from "@/utils/mathHelpers.js";

const isExporting = ref(false);

export const exportAsSVG = async (container, diagramStore, cameraStore) => {
    if (isExporting.value) return;
    isExporting.value = true;

    const originalZoom = cameraStore.zoom.value;
    const originalPan = { x: cameraStore.pan.x, y: cameraStore.pan.y };

    try {
        const bounds = calculateDiagramBounds(diagramStore.rectangles);

        const containerRect = container.getBoundingClientRect();
        const scaleX = containerRect.width / bounds.width;
        const scaleY = containerRect.height / bounds.height;
        const newZoom = Math.min(scaleX, scaleY, 1) * 0.95;

        cameraStore.setZoom(newZoom);
        cameraStore.setPan(
            containerRect.width / 2 - (bounds.x + bounds.width / 2) * newZoom,
            containerRect.height / 2 - (bounds.y + bounds.height / 2) * newZoom
        );

        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await domtoimage.toSvg(container);
        _downloadFile(dataUrl, 'diagram.svg');
    } finally {
        cameraStore.setZoom(originalZoom);
        cameraStore.setPan(originalPan.x, originalPan.y);
        isExporting.value = false;
    }
};

export const exportAsPNG = async (canvas) => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
        const dataUrl = await domtoimage.toPng(canvas);
        _downloadFile(dataUrl, 'diagram.png');
    } finally {
        isExporting.value = false;
    }
};

export const exportAsJPG = async (canvas) => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
        const dataUrl = await domtoimage.toJpeg(canvas, { quality: 0.95 });
        _downloadFile(dataUrl, 'diagram.jpg');
    } finally {
        isExporting.value = false;
    }
};

const _downloadFile = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
}

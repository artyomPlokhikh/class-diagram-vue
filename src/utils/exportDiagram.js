import domtoimage from 'dom-to-image';
import { ref } from "vue";

const isExporting = ref(false);

/**
 * Export diagram as SVG with enhanced options
 * @param {HTMLElement} container - The diagram container element
 * @param {Object} diagramStore - The diagram store instance
 * @param {Object} cameraStore - The camera store instance
 * @param {Object} options - Export options
 * @param {number} options.padding - Padding around diagram content (default: 20)
 * @param {string} options.backgroundColor - Background color (default: 'transparent')
 * @param {string} options.filename - Output filename (default: 'diagram.svg')
 * @param {number} options.safetyMargin - Additional margin as percentage (default: 0.1)
 */
export const exportAsSVG = async (container, diagramStore, cameraStore, options = {}) => {
    const exportOptions = {
        format: 'svg',
        defaultFilename: 'diagram.svg',
        defaultBackgroundColor: 'transparent',
        formatOptions: {},
        domToImageFn: domtoimage.toSvg,
        ...options
    };

    return exportDiagram(container, diagramStore, cameraStore, exportOptions);
};

/**
 * Export diagram as PNG with enhanced options
 * @param {HTMLElement} container - The diagram canvas element
 * @param {Object} diagramStore - The diagram store instance
 * @param {Object} cameraStore - The camera store instance
 * @param {Object} options - Export options
 * @param {number} options.padding - Padding around diagram content (default: 20)
 * @param {string} options.backgroundColor - Background color (default: 'white')
 * @param {number} options.scale - Output scale factor (default: 2 for higher resolution)
 * @param {string} options.filename - Output filename (default: 'diagram.png')
 * @param {number} options.safetyMargin - Additional margin as percentage (default: 0.1)
 */
export const exportAsPNG = async (container, diagramStore, cameraStore, options = {}) => {
    const scale = options.scale ?? 2;

    const exportOptions = {
        format: 'png',
        defaultFilename: 'diagram.png',
        defaultBackgroundColor: 'white',
        formatOptions: {
            pixelRatio: scale
        },
        domToImageFn: domtoimage.toPng,
        ...options
    };

    return exportDiagram(container, diagramStore, cameraStore, exportOptions);
};

/**
 * Export diagram as JPG with enhanced options
 * @param {HTMLElement} container - The diagram canvas element
 * @param {Object} diagramStore - The diagram store instance
 * @param {Object} cameraStore - The camera store instance
 * @param {Object} options - Export options
 * @param {number} options.padding - Padding around diagram content (default: 20)
 * @param {string} options.backgroundColor - Background color (default: 'white')
 * @param {number} options.quality - JPEG quality from 0 to 1 (default: 0.95)
 * @param {number} options.scale - Output scale factor (default: 2 for higher resolution)
 * @param {string} options.filename - Output filename (default: 'diagram.jpg')
 * @param {number} options.safetyMargin - Additional margin as percentage (default: 0.1)
 */
export const exportAsJPG = async (container, diagramStore, cameraStore, options = {}) => {
    const scale = options.scale ?? 2;
    const quality = options.quality ?? 0.95;

    const exportOptions = {
        format: 'jpg',
        defaultFilename: 'diagram.jpg',
        defaultBackgroundColor: 'white',
        formatOptions: {
            quality,
            pixelRatio: scale
        },
        domToImageFn: domtoimage.toJpeg,
        ...options
    };

    return exportDiagram(container, diagramStore, cameraStore, exportOptions);
};

export const exportAsJson = async (diagramStore, options) => {
    if (isExporting.value) return;
    isExporting.value = true;
    try {
        const json = diagramStore.exportJSON();

        if (!json) {
            console.warn('No diagram data to export');
            return null;
        }

        if (options.download !== false) {
            const filename = options.filename || 'diagram.json';
            const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
            _downloadFile(dataUrl, filename);
        }
    } catch (error) {
        console.error('Error exporting diagram as JSON:', error);
    } finally {
        isExporting.value = false;
    }
}

/**
 * Common function to handle diagram exports in different formats
 * @param {HTMLElement} container - The diagram container element
 * @param {Object} diagramStore - The diagram store instance
 * @param {Object} cameraStore - The camera store instance
 * @param {Object} options - Combined export options
 */
const exportDiagram = async (container, diagramStore, cameraStore, options) => {
    if (isExporting.value) return;
    isExporting.value = true;

    const {
        padding = 20,
        backgroundColor = options.defaultBackgroundColor,
        filename = options.defaultFilename,
        safetyMargin = 0.1,
        formatOptions = {},
        dimensionsTransform = (dimensions, zoom) => ({
            width: dimensions.width * zoom,
            height: dimensions.height * zoom
        }),
        domToImageFn
    } = options;

    try {
        await diagramStore.temporarilyDeselect(async () => {
            const viewport = container.querySelector('.diagram-canvas__viewport');
            const originalBackgroundImage = viewport ? viewport.style.backgroundImage : null;
            if (viewport) viewport.style.backgroundImage = 'none';

            await cameraStore.fitObjectsTemporarily(
                diagramStore.getPositionedObjects(),
                async (dimensions, zoom) => {
                    const exportDimensions = dimensionsTransform(dimensions, zoom);

                    const dataUrl = await domToImageFn(container, {
                        bgcolor: backgroundColor,
                        width: exportDimensions.width,
                        height: exportDimensions.height,
                        ...formatOptions
                    });

                    _downloadFile(dataUrl, filename);
                },
                { padding, safetyMargin }
            );

            if (viewport && originalBackgroundImage !== null) {
                viewport.style.backgroundImage = originalBackgroundImage;
            }
        });
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

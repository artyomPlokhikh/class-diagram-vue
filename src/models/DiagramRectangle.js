export default class DiagramRectangle {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 275;
        this.height = options.height || 120;
        this.type = options.type || 'rectangle';
    }

    toJSON() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}


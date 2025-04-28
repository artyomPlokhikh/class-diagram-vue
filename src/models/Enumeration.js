export default class Enumeration {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || 'New Enumeration';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 275;
        this.height = options.height || 120;
        this.values = options.values || ['Value1', 'Value2', 'Value3'];
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            values: this.values
        };
    }
}
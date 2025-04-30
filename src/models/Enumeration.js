import DiagramRectangle from "@/models/DiagramRectangle.js";

export default class Enumeration extends DiagramRectangle {
    constructor(options = {}) {
        options.type = 'enumeration';
        super(options);
        this.name = options.name || 'New Enumeration';
        this.values = options.values || ['Value1', 'Value2', 'Value3'];
    }

    toJSON() {
        return {
            ...super.toJSON(),
            name: this.name,
            values: this.values
        };
    }
}

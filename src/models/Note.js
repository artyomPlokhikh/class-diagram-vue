import DiagramRectangle from "@/models/DiagramRectangle.js";

export default class Note extends DiagramRectangle {
    constructor(options = {}) {
        options.type = 'note';
        if (!options.width) options.width = 200;
        if (!options.height) options.height = 100;
        
        super(options);
        this.content = options.content || 'New Note';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            content: this.content
        };
    }
}

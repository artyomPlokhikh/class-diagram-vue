import Attribute from "@/models/Attribute.js"
import Method from "@/models/Method.js";
import DiagramRectangle from "@/models/DiagramRectangle.js";

export default class Entity extends DiagramRectangle {
    constructor(options = {}) {
        options.type = 'entity';
        super(options);
        this.name = options.name || 'New Entity';
        this.annotation = options.annotation || '';
        this.attributes = options.attributes ? options.attributes.map(a => new Attribute(a)) : [];
        this.methods = options.methods ? options.methods.map(a => new Method(a)) : [];
    }

    toJSON() {
        return {
            ...super.toJSON(),
            name: this.name,
            annotation: this.annotation,
            attributes: this.attributes.map(a => a.toJSON()),
            methods: this.methods.map(m => m.toJSON())
        };
    }
}

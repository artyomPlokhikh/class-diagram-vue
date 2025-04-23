import Attribute from "@/models/Attribute.js"
import Method from "@/models/Method.js";

export default class Entity {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || 'New Entity';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 275;
        this.height = options.height || 120;

        this.attributes = options.attributes ? options.attributes.map(a => new Attribute(a)) : [];
        this.methods = options.methods ? options.methods.map(a => new Method(a)) : [];
    }

    addAttribute() {
        this.attributes.push(new Attribute());
    };

    removeAttribute(id) {
        this.attributes = this.attributes.filter(a => a.id !== id);
    };

    addMethod() {
        this.methods.push(new Method());
    };

    removeMethod(id) {
        this.methods = this.methods.filter(m => m.id !== id);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            attributes: this.attributes.map(a => a.toJSON()),
            methods: this.methods.map(m => m.toJSON())
        };
    };
}

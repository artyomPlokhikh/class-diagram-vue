import Attribute from "@/models/Attribute.js"

export default class Entity {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || 'New Entity';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 275;
        this.height = options.height || 120;
        this.attributes = options.attributes || [];

        if (!this.attributes.length) this.addAttribute();
    }

    addAttribute() {
        this.attributes.push(new Attribute());
    };

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            attributes: this.attributes.map(a => a.toJSON())
        };
    };
}

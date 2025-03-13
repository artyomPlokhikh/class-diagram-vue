import Attribute from "@/models/Attribute.js";

export default class Entity {
    constructor(id, name, x = 0, y = 0) {
        this.id = id || Date.now()
        this.name = name || 'New Entity'
        this.x = x
        this.y = y
        this.attributes = []
    }

    addAttribute(attr) {
        this.attributes.push(new Attribute(
            Date.now(),
            attr.name,
            attr.type,
            attr.isPrimaryKey || false
        ))
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            attributes: this.attributes.map(a => a?.toJSON ? a.toJSON() : a)
        }
    }
}
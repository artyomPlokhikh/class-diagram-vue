import Attribute from "@/models/Attribute.js"

export default class Entity {
    constructor(id, name, x = 0, y = 0, width = 275, height = 120) {
        this.id = id || Date.now()
        this.name = name || 'New Entity'
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.attributes = []

        this.addAttribute()
    }

    addAttribute(attr = {}) {
        this.attributes.push(new Attribute(
            Date.now(),
            attr.name || 'New Attribute',
            attr.type || 'VARCHAR',
            attr.isPrimaryKey || false,
        ))
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            attributes: this.attributes.map(a => a?.toJSON ? a.toJSON() : a)
        }
    }
}

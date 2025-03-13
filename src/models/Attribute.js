export default class Attribute {
    constructor(id, name, type, isPrimaryKey = false) {
        this.id = id
        this.name = name
        this.type = type
        this.isPrimaryKey = isPrimaryKey
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            isPrimaryKey: this.isPrimaryKey
        }
    }
}

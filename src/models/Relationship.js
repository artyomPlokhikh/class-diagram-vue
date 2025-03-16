export default class Relationship {
    static TYPES = {
        ONE_TO_ONE: '1:1',
        ONE_TO_MANY: '1:M',
        MANY_TO_MANY: 'M:N'
    }

    constructor(id, from, to, type = this.type.ONE_TO_MANY) {
        this.id = id || Date.now()
        this.from = from
        this.to = to
        this.type = type
        this.points = []
        this.selected = false
    }

    toJSON() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            type: this.type,
            points: this.points
        }
    }
}

export default class Relationship {
    static TYPES = {
        ONE_TO_ONE: '1:1',
        ONE_TO_MANY: '1:M',
        MANY_TO_MANY: 'M:N'
    }

    /**
     * @param {{from}} from - Entity id
     */
    constructor(from) {
        this.id = Date.now()
        this.from = from
        this.to = null
        this.type = Relationship.TYPES.ONE_TO_ONE
        this.points = []
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

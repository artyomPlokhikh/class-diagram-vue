export default class Relationship {
    static TYPES = {
        ONE_TO_ONE: '1:1',
        ONE_TO_MANY: '1:M',
        MANY_TO_MANY: 'M:N'
    }

    constructor(options) {
        if (typeof options !== 'object' || options === null) {
            throw new Error('Options object is required')
        }
        this.id = options.id || Date.now();
        this.sourceId = options.sourceId || null
        this.targetId = options.targetId || null
        this.type = options.type || null
        this.points = options.points || []
    }

    toJSON() {
        return {
            id: this.id,
            sourceId: this.sourceId,
            targetId: this.targetId,
            type: this.type,
            points: this.points
        }
    }
}

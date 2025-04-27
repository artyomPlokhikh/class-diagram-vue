export default class Relationship {
    static TYPES = {
        ASSOCIATION: 'association',
        INHERITANCE: 'inheritance',
        DEPENDENCY: 'dependency',
        AGGREGATION: 'aggregation',
        COMPOSITION: 'composition'
    };

    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || '';
        this.type = options.type || Relationship.TYPES.ASSOCIATION;
        this.src = {
            id: options.src?.id || null,
            border: options.src?.border || 'top',
            position: options.src?.position || 0.5,
            mult: options.src?.mult || '',
        };
        this.trg = {
            id: options.trg?.id || null,
            border: options.trg?.border || 'top',
            position: options.trg?.position || 0.5,
            mult: options.trg?.mult || '',
        };
        this.bendPoints = options.bendPoints || [];
    };

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            src: { ...this.src },
            trg: { ...this.trg },
            bendPoints: this.bendPoints.map(p => ({ ...p })),
        };
    };
}
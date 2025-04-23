export default class Relationship {
    static TYPES = {
        INHERITANCE:  'inheritance',
        ASSOCIATION:  'association',
        AGGREGATION:  'aggregation',
        COMPOSITION:  'composition',
        DEPENDENCY:   'dependency'
    };

    static CONNECTORS = {
        T_0: { side: 'T', index: 0 }, T_1: { side: 'T', index: 1 }, T_2: { side: 'T', index: 2 },
        R_0: { side: 'R', index: 0 }, R_1: { side: 'R', index: 1 }, R_2: { side: 'R', index: 2 },
        B_0: { side: 'B', index: 0 }, B_1: { side: 'B', index: 1 }, B_2: { side: 'B', index: 2 },
        L_0: { side: 'L', index: 0 }, L_1: { side: 'L', index: 1 }, L_2: { side: 'L', index: 2 }
    };

    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || '';
        this.type = options.type || Relationship.TYPES.ASSOCIATION;
        this.source = {
            id: options.source?.id || null,
            port: options.source?.port || null,
            multiplicity: options.source?.multiplicity || '1',
        };
        this.target = {
            id: options.target?.id || null,
            port: options.target?.port || null,
            multiplicity: options.target?.multiplicity || '1',
        };
        this.points = options.points || [];
    };

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            source: this.source,
            target: this.target,
            points: this.points
        };
    };
}
export default class Attribute {
    static VISIBILITY = {
        PUBLIC: {
            name: 'public',
            literal: '+'
        },
        PACKAGE: {
            name: 'package',
            literal: '~'
        },
        PROTECTED: {
            name: 'protected',
            literal: '#'
        },
        PRIVATE: {
            name: 'private',
            literal: '-'
        }
    };

    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || 'New Attribute';
        this.type = options.type || 'VARCHAR';
        this.visibility = Attribute.VISIBILITY.PUBLIC;
    };

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            visibility: this.visibility,
        };
    };
}

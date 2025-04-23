const Visibility = Object.freeze({
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
});

export default Visibility;
export default class Note {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.content = options.content || 'New Note';
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 200;
        this.height = options.height || 100;
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
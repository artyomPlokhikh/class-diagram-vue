export default class HistoryManager {
    constructor({ maxSize = 50, persistenceKey = null } = {}) {
        this.maxSize = maxSize;
        this.key = persistenceKey;
        this.stack = [];
        this.ptr = -1;

        if (this.key) {
            const saved = localStorage.getItem(this.key);
            if (saved) {
                try {
                    const arr = JSON.parse(saved);
                    this.stack = Array.isArray(arr) ? arr : [];
                    this.ptr = this.stack.length - 1;
                } catch {
                }
            }
        }
    };

    get canUndo() {
        return this.ptr > 0;
    };

    get canRedo() {
        return this.ptr < this.stack.length - 1
    };

    push(snapshot) {
        if (this.ptr >= 0 && this.stack[this.ptr] === snapshot) return;

        if (this.ptr < this.stack.length - 1) {
            this.stack.splice(this.ptr + 1);
        }
        this.stack.push(snapshot);
        if (this.stack.length > this.maxSize) {
            this.stack.shift();
        }
        this.ptr = this.stack.length - 1;
        this._persist()
        console.log(`Push: ${this.ptr}`);
    };

    undo() {
        if (!this.canUndo) return null;
        this.ptr -= 1;
        this._persist();
        console.log(`Undo: ${this.ptr}`);
        return this.stack[this.ptr];
    };

    redo() {
        if (!this.canRedo) return null;
        this.ptr += 1;
        this._persist();
        console.log(`Redo: ${this.ptr}`);
        return this.stack[this.ptr];
    };

    clear() {
        this.stack = [];
        this.ptr = -1;
        this._persist();
    };

    _persist() {
        if (!this.key) return;
        try {
            localStorage.setItem(this.key, JSON.stringify(this.stack));
        } catch {
        }
    };
}

export default class HistoryManager {
    #maxSize;
    #key;
    #stack = [];
    #ptr = -1;

    constructor({ maxSize = 50, persistenceKey = null } = {}) {
        this.#maxSize = maxSize;
        this.#key = persistenceKey;

        if (this.#key) {
            try {
                const arr = JSON.parse(localStorage.getItem(this.#key)) || [];
                this.#stack = Array.isArray(arr) ? arr : [];
                this.#ptr = this.#stack.length - 1;
            } catch {
            }
        }
    }

    get current() {
        return this.#ptr < 0
            ? null
            : this.#stack[this.#ptr];
    }

    get canUndo() {
        return this.#ptr > 0;
    }

    get canRedo() {
        return this.#ptr < this.#stack.length - 1;
    }

    push(snapshot) {
        if (this.#stack[this.#ptr] === snapshot) return;

        if (this.#ptr < this.#stack.length - 1) {
            this.#stack.splice(this.#ptr + 1);
        }
        this.#stack.push(snapshot);
        if (this.#stack.length > this.#maxSize) {
            this.#stack.shift();
        }
        this.#ptr = this.#stack.length - 1;
        this.#persist();
    }

    undo() {
        if (!this.canUndo) return null;
        this.#ptr--;
        this.#persist();
        return this.#stack[this.#ptr];
    }

    redo() {
        if (!this.canRedo) return null;
        this.#ptr++;
        this.#persist();
        return this.#stack[this.#ptr];
    }

    clear() {
        this.#stack = [];
        this.#ptr = -1;
        this.#persist();
    }

    #persist() {
        if (!this.#key) return;
        try {
            localStorage.setItem(this.#key, JSON.stringify(this.#stack));
        } catch {
        }
    }
}

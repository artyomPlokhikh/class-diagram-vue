/**
 * History Manager for Undo/Redo Functionality
 *
 * This class implements a history stack that stores diagram states and provides
 * methods to navigate through them (undo/redo). It supports:
 * - Configurable history size limit
 * - Local storage persistence
 * - State snapshot management
 * - JSON import/export
 *
 * The class uses private fields (#) to prevent direct external manipulation
 * of the history stack and internal properties.
 */
export default class HistoryManager {
    #maxSize;      // Maximum number of history entries to keep
    #key;          // LocalStorage key for persistence
    #stack = [];   // The history stack containing diagram snapshots
    #ptr = -1;     // Pointer to current position in history stack

    /**
     * Creates a new HistoryManager instance
     *
     * @param {Object} options - Configuration options
     * @param {number} options.maxSize - Maximum number of history entries (default: 50)
     * @param {string} options.persistenceKey - LocalStorage key for persistence (optional)
     */
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

    /**
     * Adds a new state to the history stack
     * Discards any future states if we're not at the end of the stack
     * Enforces maximum stack size by removing oldest entries
     *
     * @param {*} snapshot - The state to save
     */
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

    /**
     * Persists the history stack to localStorage if a key was provided
     * Uses a private method to indicate it's for internal use only
     */
    #persist() {
        if (!this.#key) return;
        try {
            localStorage.setItem(this.#key, JSON.stringify(this.#stack));
        } catch {
        }
    }

    /**
     * Imports a JSON string as the current diagram state
     * Replaces the entire history stack with just this imported state
     *
     * @param {string} json - JSON string to import
     * @returns {boolean} Success or failure
     */
    importJSON(json) {
        try {
            JSON.parse(json);

            this.#stack = [json];
            this.#ptr = 0;
            this.#persist();
            return true;
        } catch (error) {
            console.error('Error importing JSON:', error);
            return false;
        }
    }
}

import Visibility from '@/models/Visibility.js';
import Type from "@/models/Type.js";

export default class Method {
    constructor(options = {}) {
        this.id = options.id || Date.now();
        this.name = options.name || 'newMethod';
        this.type = options.type || Type.VOID;
        this.visibility = Visibility.PUBLIC;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            visibility: this.visibility,
        };
    };
}
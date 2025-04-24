import { defineStore } from 'pinia';
import Entity from '@/models/Entity';
import Attribute from '@/models/Attribute';
import Relationship from '@/models/Relationship';
import Method from "@/models/Method.js";

export const useDiagramStore = defineStore('diagram', {
    state: () => ({
        selected: null,
        entities: [],
        relationships: [],
    }),
    actions: {
        setSelected(item) {
            this.selected = item;
        },

        addEntity() {
            const entity = new Entity();
            this.entities.push(entity);
            this.setSelected(entity);
            this.saveState();
        },

        deleteEntity(id) {
            if (this.selected && this.selected.id === id) this.setSelected(null);

            this.entities = this.entities.filter(e => e.id !== id);
            this.relationships = this.relationships.filter(rel =>
                rel.src.id !== id && rel.trg.id !== id
            );

            this.saveState();
        },

        addRelationship(relationship) {
            if (relationship instanceof Relationship) {
                this.relationships.push(relationship);

                this.setSelected(relationship);
                this.saveState();
            }
        },

        deleteRelationship(id) {
            if (this.selected && this.selected.id === id) this.selected = null;

            this.relationships = this.relationships.filter(r => r.id !== id);

            this.saveState();
        },

        saveState() {
            const state = {
                entities: this.entities.map(e => e.toJSON()),
                relationships: this.relationships.map(r => r.toJSON())
            };
            localStorage.setItem('erDiagram', JSON.stringify(state));
        },

        loadState() {
            const saved = localStorage.getItem('erDiagram');
            if (!saved) return;

            try {
                const state = JSON.parse(saved);
                this.entities = state.entities.map(e => new Entity(e));
                this.entities.forEach(entity => {
                    entity.attributes = entity.attributes.map(a => new Attribute(a));
                    entity.methods = entity.methods.map(m => new Method(m));
                });
                this.relationships = state.relationships.map(r => new Relationship(r));
            } catch (error) {
                console.error('Failed to load state:', error);
                this.entities = [];
                this.relationships = [];
            }
        },

        undo() {
            // TODO: Implement undo functionality
        },

        redo() {
            // TODO: Implement redo functionality
        },

        exportDiagram() {
            // TODO: Implement export functionality
        },

        clear() {
            this.entities = [];
            this.relationships = [];
            this.selected = null;
            this.saveState();
        }
    }
})

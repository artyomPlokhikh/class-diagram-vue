import { defineStore } from 'pinia';
import Entity from '@/models/Entity';
import Attribute from '@/models/Attribute';
import Method from '@/models/Method';
import Relationship from '@/models/Relationship';
import HistoryManager from '@/utils/HistoryManager';

export const useDiagramStore = defineStore('diagram', {
    state: () => ({
        entities: [],
        relationships: [],
        selectedId: null,
        selectedType: null,
        history: null,
    }),

    getters: {
        selected(state) {
            if (!state.selectedId) return null;
            const arr = state.selectedType === 'entity'
                ? state.entities
                : state.relationships;
            return arr.find(i => i.id === state.selectedId) || null;
        }
    },

    actions: {
        // INITIALIZATION
        init() {
            this.history = new HistoryManager({
                maxSize: 30,
                persistenceKey: 'erDiagramHistory'
            });
            const last = this.history.stack[this.history.ptr];
            if (last) {
                this._restore(last);
            } else {
                this._pushHistory();
            }
        },


        // PRIVATE METHODS
        _snapshot() {
            return JSON.stringify({
                entities: this.entities.map(e => e.toJSON()),
                relationships: this.relationships.map(r => r.toJSON()),
            });
        },

        _restore(snapshot) {
            const s = JSON.parse(snapshot);

            const newEntities = [];
            s.entities.forEach(ed => {
                const ent = this.entities.find(e => e.id === ed.id);
                if (ent) {
                    ent.x = ed.x;
                    ent.y = ed.y;
                    ent.width = ed.width;
                    ent.height = ed.height;
                    ent.attributes = ed.attributes.map(ad => {
                        const a = ent.attributes.find(a => a.id === ad.id);
                        if (a) {
                            a.name = ad.name;
                            a.type = ad.type;
                            a.visibility = ad.visibility;
                            return a;
                        }
                        return new Attribute(ad);
                    });
                    ent.methods = ed.methods.map(md => {
                        const m = ent.methods.find(m => m.id === md.id);
                        if (m) {
                            m.name = md.name;
                            m.type = md.type;
                            m.visibility = md.visibility;
                            return m;
                        }
                        return new Method(md);
                    });
                    newEntities.push(ent);
                } else {
                    const e = new Entity(ed);
                    e.attributes = ed.attributes.map(a => new Attribute(a));
                    e.methods = ed.methods.map(m => new Method(m));
                    newEntities.push(e);
                }
            });
            this.entities = newEntities;

            const newRels = [];
            s.relationships.forEach(rd => {
                const rel = this.relationships.find(r => r.id === rd.id);
                if (rel) {
                    rel.name = rd.name;
                    rel.type = rd.type;
                    rel.src = { ...rd.src };
                    rel.trg = { ...rd.trg };
                    rel.bendPoints = rd.bendPoints.map(p => ({ x: p.x, y: p.y }));
                    newRels.push(rel);
                } else {
                    newRels.push(new Relationship(rd));
                }
            });
            this.relationships = newRels;
        },

        _pushHistory() {
            this.history.push(this._snapshot());
        },


        // PUBLIC METHODS
        undo() {
            const prev = this.history.undo();
            if (prev) this._restore(prev);
        },
        redo() {
            const next = this.history.redo();
            if (next) this._restore(next);
        },
        clearHistory() {
            this.history.clear();
            this._pushHistory();
        },
        save() {
            this._pushHistory()
        },


        // MUTATIONS
        setSelected(item) {
            if (!item) {
                this.selectedId = this.selectedType = null;
                return;
            }
            this.selectedId = item.id;

            if (item instanceof Entity) {
                this.selectedType = 'entity';
            } else if (item instanceof Relationship) {
                this.selectedType = 'relationship';
            } else {
                this.selectedType = null;
            }
        },

        addEntity() {
            this.entities.push(new Entity());
            this.setSelected(this.entities.at(-1));
            this._pushHistory();
        },

        deleteEntity(id) {
            this.entities = this.entities.filter(e => e.id !== id);
            this.relationships = this.relationships.filter(r =>
                r.src.id !== id && r.trg.id !== id
            );
            if (this.selectedType === 'entity' && this.selectedId === id) {
                this.setSelected(null);
            }
            this._pushHistory();
        },

        addAttribute(entityId) {
            const e = this.entities.find(e => e.id === entityId);
            if (!e) return;
            e.attributes.push(new Attribute());
            this.setSelected(e);
            this._pushHistory();
        },

        removeAttribute(entityId, attrId) {
            const e = this.entities.find(e => e.id === entityId);
            if (!e) return;
            e.attributes = e.attributes.filter(a => a.id !== attrId);
            this.setSelected(e);
            this._pushHistory();
        },

        addMethod(entityId) {
            const e = this.entities.find(e => e.id === entityId);
            if (!e) return;
            e.methods.push(new Method());
            this.setSelected(e);
            this._pushHistory();
        },

        removeMethod(entityId, mId) {
            const e = this.entities.find(e => e.id === entityId);
            if (!e) return;
            e.methods = e.methods.filter(m => m.id !== mId);
            this.setSelected(e);
            this._pushHistory();
        },

        addRelationship(rel) {
            if (!(rel instanceof Relationship)) return;
            this.relationships.push(rel);
            this.setSelected(rel);
            this._pushHistory();
        },

        updateRelationship(updated) {
            const idx = this.relationships.findIndex(r => r.id === updated.id);
            if (idx < 0) return;
            this.relationships.splice(idx, 1, updated);
            this.setSelected(updated);
            this._pushHistory();
        },

        deleteRelationship(id) {
            this.relationships = this.relationships.filter(r => r.id !== id);
            if (this.selectedType === 'relationship' && this.selectedId === id) {
                this.setSelected(null);
            }
            this._pushHistory();
        },

        clearDiagram() {
            this.entities = [];
            this.relationships = [];
            this.setSelected(null);
            this.clearHistory();
        }
    }
});

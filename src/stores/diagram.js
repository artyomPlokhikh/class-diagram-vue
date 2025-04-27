import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import Entity from '@/models/Entity';
import Attribute from '@/models/Attribute';
import Method from '@/models/Method';
import Relationship from '@/models/Relationship';
import HistoryManager from '@/utils/HistoryManager';

export const useDiagramStore = defineStore('diagram', () => {
    const entities = ref([]);
    const relationships = ref([]);
    const selectedId = ref(null);
    const selectedType = ref(null);
    const history = ref(null);

    const selected = computed(() => {
        if (!selectedId.value) {
            return null;
        }
        const arr = selectedType.value === 'entity'
            ? entities.value
            : relationships.value;
        return arr.find(i => i.id === selectedId.value) || null;
    });

    const init = () => {
        history.value = markRaw(new HistoryManager({
            maxSize: 30,
            persistenceKey: 'erDiagramHistory'
        }));
        const last = history.value.current;
        if (last) {
            _restore(last);
        } else {
            _pushHistory();
        }
    };

    const _snapshot = () => JSON.stringify({
        entities: entities.value.map(e => e.toJSON()),
        relationships: relationships.value.map(r => r.toJSON())
    });

    const _restore = snapshot => {
        const s = JSON.parse(snapshot);
        const newEntities = [];
        s.entities.forEach(ed => {
            const ent = entities.value.find(e => e.id === ed.id);
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
        entities.value = newEntities;

        const newRels = [];
        s.relationships.forEach(rd => {
            const rel = relationships.value.find(r => r.id === rd.id);
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
        relationships.value = newRels;
    };

    const _pushHistory = () => {
        history.value.push(_snapshot());
    };

    const undo = () => {
        const prev = history.value.undo();
        if (prev) {
            _restore(prev);
        }
    };

    const redo = () => {
        const next = history.value.redo();
        if (next) {
            _restore(next);
        }
    };

    const clearHistory = () => {
        history.value.clear();
        _pushHistory();
    };

    const save = () => {
        _pushHistory();
    };

    const setSelected = item => {
        if (!item) {
            selectedId.value = null;
            selectedType.value = null;
            return;
        }
        selectedId.value = item.id;
        if (item instanceof Entity) {
            selectedType.value = 'entity';
        } else if (item instanceof Relationship) {
            selectedType.value = 'relationship';
        } else {
            selectedType.value = null;
        }
    };

    const addEntity = entity => {
        entities.value.push(new Entity(entity));
        setSelected(entities.value.at(-1));
        _pushHistory();
    };

    const deleteEntity = id => {
        entities.value = entities.value.filter(e => e.id !== id);
        relationships.value = relationships.value.filter(
            r => r.src.id !== id && r.trg.id !== id
        );
        if (selectedType.value === 'entity' && selectedId.value === id) {
            setSelected(null);
        }
        _pushHistory();
    };

    const addAttribute = entityId => {
        const e = entities.value.find(e => e.id === entityId);
        if (!e) {
            return;
        }
        e.attributes.push(new Attribute());
        setSelected(e);
        _pushHistory();
    };

    const removeAttribute = (entityId, attrId) => {
        const e = entities.value.find(e => e.id === entityId);
        if (!e) {
            return;
        }
        e.attributes = e.attributes.filter(a => a.id !== attrId);
        setSelected(e);
        _pushHistory();
    };

    const addMethod = entityId => {
        const e = entities.value.find(e => e.id === entityId);
        if (!e) {
            return;
        }
        e.methods.push(new Method());
        setSelected(e);
        _pushHistory();
    };

    const removeMethod = (entityId, mId) => {
        const e = entities.value.find(e => e.id === entityId);
        if (!e) {
            return;
        }
        e.methods = e.methods.filter(m => m.id !== mId);
        setSelected(e);
        _pushHistory();
    };

    const addRelationship = rel => {
        if (!(rel instanceof Relationship)) {
            return;
        }
        relationships.value.push(rel);
        setSelected(rel);
        _pushHistory();
    };

    const updateRelationship = updated => {
        const idx = relationships.value.findIndex(r => r.id === updated.id);
        if (idx < 0) {
            return;
        }
        relationships.value.splice(idx, 1, updated);
        setSelected(updated);
        _pushHistory();
    };

    const deleteRelationship = id => {
        relationships.value = relationships.value.filter(r => r.id !== id);
        if (
            selectedType.value === 'relationship' &&
            selectedId.value === id
        ) {
            setSelected(null);
        }
        _pushHistory();
    };

    const clearDiagram = () => {
        entities.value = [];
        relationships.value = [];
        setSelected(null);
        clearHistory();
    };

    return {
        entities,
        relationships,
        selectedId,
        selectedType,
        history,
        selected,
        init,
        undo,
        redo,
        clearHistory,
        save,
        setSelected,
        addEntity,
        deleteEntity,
        addAttribute,
        removeAttribute,
        addMethod,
        removeMethod,
        addRelationship,
        updateRelationship,
        deleteRelationship,
        clearDiagram,
    };
});

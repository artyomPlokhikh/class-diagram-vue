import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import Entity from '@/models/Entity';
import Attribute from '@/models/Attribute';
import Method from '@/models/Method';
import Relationship from '@/models/Relationship';
import HistoryManager from '@/utils/HistoryManager';
import Note from "@/models/Note.js";
import Enumeration from "@/models/Enumeration.js";

export const useDiagramStore = defineStore('diagram', () => {
    const rectangles = computed(() => {
        return [
            ...entities.value,
            ...notes.value,
            ...enumerations.value
        ];
    })

    const entities = ref([]);
    const relationships = ref([]);
    const notes = ref([]);
    const enumerations = ref([]);

    const selectedId = ref(null);
    const selectedType = ref(null);

    const selected = computed(() => {
        if (!selectedId.value || !selectedType.value) return null;

        switch (selectedType.value) {
            case 'entity':
                return entities.value.find(e => e.id === selectedId.value) || null;
            case 'relationship':
                return relationships.value.find(r => r.id === selectedId.value) || null;
            case 'note':
                return notes.value.find(n => n.id === selectedId.value) || null;
            case 'enumeration':
                return enumerations.value.find(e => e.id === selectedId.value) || null;
            default:
                return null;
        }
    });

    const history = ref(null);

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
        relationships: relationships.value.map(r => r.toJSON()),
        notes: notes.value.map(n => n.toJSON()),
        enumerations: enumerations.value.map(e => e.toJSON())
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
                e.attributes = ed.attributes?.map(a => new Attribute(a));
                e.methods = ed.methods?.map(m => new Method(m));
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

        const newNotes = [];
        notes.value = s.notes.map(nd => {
            const note = notes.value.find(n => n.id === nd.id);
            if (note) {
                note.content = nd.content;
                note.x = nd.x;
                note.y = nd.y;
                note.width = nd.width;
                note.height = nd.height;
                newNotes.push(note);
            } else {
                newNotes.push(new Note(nd));
            }
        });
        notes.value = newNotes;

        const newEnums = [];
        enumerations.value = s.enumerations.map(ed => {
            const en = enumerations.value.find(e => e.id === ed.id);
            if (en) {
                en.name = ed.name;
                en.x = ed.x;
                en.y = ed.y;
                en.width = ed.width;
                en.height = ed.height;
                newEnums.push(en);
            } else {
                newEnums.push(new Enumeration(ed));
            }
        });
        enumerations.value = newEnums;

        updateHistoryState();
    };

    const _pushHistory = () => {
        history.value.push(_snapshot());
        updateHistoryState();
    };

    const canUndo = ref(false);
    const canRedo = ref(false);

    const updateHistoryState = () => {
        canUndo.value = history.value?.canUndo || false;
        canRedo.value = history.value?.canRedo || false;
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

    const importJSON = json => {
        if (!json) {
            console.warn('No diagram data to import');
            return null;
        }
        const parsed = JSON.parse(json);
        if (parsed) {
            _restore(json);
            return true;
        }
        return false;
    };

    const exportJSON = () => {
        const json = _snapshot();
        if (!json) {
            console.warn('No diagram data to export');
            return null;
        }
        return json;
    };

    const setSelected = item => {
        if (!item) {
            selectedId.value = selectedType.value = null;
            return;
        }
        selectedId.value = item.id;
        if (item instanceof Entity) selectedType.value = 'entity';
        else if (item instanceof Relationship) selectedType.value = 'relationship';
        else if (item instanceof Note) selectedType.value = 'note';
        else if (item instanceof Enumeration) selectedType.value = 'enumeration';
        else selectedType.value = null;
    };

    const findDiagramElement = (id, type) => {
        const collections = {
            'entity': entities.value,
            'relationship': relationships.value,
            'note': notes.value,
            'enumeration': enumerations.value,
        };

        return collections[type]?.find(item => item.id === id) || null;
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
        if (selectedId.value === id) setSelected(null);
        _pushHistory();
    };

    const addNote = (options = {}) => {
        const n = new Note(options);
        notes.value.push(n);
        setSelected(n);
        _pushHistory();
    };

    const deleteNote = (id) => {
        notes.value = notes.value.filter(n => n.id !== id);
        relationships.value = relationships.value.filter(
            r => r.src.id !== id && r.trg.id !== id
        );
        if (selectedId.value === id) setSelected(null);
        _pushHistory();
    };

    const addEnumeration = (options = {}) => {
        const e = new Enumeration(options);
        enumerations.value.push(e);
        setSelected(e);
        _pushHistory();
    };

    const deleteEnumeration = (id) => {
        enumerations.value = enumerations.value.filter(e => e.id !== id);
        relationships.value = relationships.value.filter(
            r => r.src.id !== id && r.trg.id !== id
        );
        if (selectedId.value === id) setSelected(null);
        _pushHistory();
    }

    const clearDiagram = () => {
        entities.value = [];
        relationships.value = [];
        notes.value = [];
        enumerations.value = [];
        setSelected(null);
        clearHistory();
    };

    const temporarilyDeselect = async (callback) => {
        const currentSelectedId = selectedId.value;
        const currentSelectedType = selectedType.value;

        setSelected(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 50));

            return await callback();
        } finally {
            if (currentSelectedId && currentSelectedType) {
                const item = findDiagramElement(currentSelectedId, currentSelectedType);
                if (item) {
                    setSelected(item);
                }
            }
        }
    };

    const getPositionedObjects = () => {
        return [
            ...rectangles.value,
            ...relationships.value.flatMap(r =>
                r.bendPoints.map(p => ({ x: p.x, y: p.y }))
            )
        ]
    }

    return {
        rectangles,
        entities,
        relationships,
        notes,
        enumerations,
        selectedId,
        selectedType,
        history,
        selected,
        init,
        undo,
        redo,
        clearHistory,
        canUndo,
        canRedo,
        save,
        importJSON,
        exportJSON,
        setSelected,
        findDiagramElement,
        addEntity,
        deleteEntity,
        addAttribute,
        removeAttribute,
        addMethod,
        removeMethod,
        addRelationship,
        addNote,
        deleteNote,
        updateRelationship,
        deleteRelationship,
        addEnumeration,
        deleteEnumeration,
        clearDiagram,
        temporarilyDeselect,
        getPositionedObjects,
    };
});

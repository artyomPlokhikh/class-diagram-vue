import {defineStore} from 'pinia'
import Entity from '@/models/Entity'
import Attribute from '@/models/Attribute'
import Relationship from '@/models/Relationship'

export const useDiagramStore = defineStore('diagram', {
    state: () => ({
        selected: null,
        entities: [],
        relationships: [],
    }),
    actions: {
        setSelected(item) {
            this.selected = item
        },

        addEntity(position) {
            const entity = new Entity(
                Date.now(),
                'New Entity',
                position.x,
                position.y
            )
            this.entities.push(entity)
            this.setSelected(entity)
            this.saveState()
        },
        deleteEntity(id) {
            this.entities = this.entities.filter(e => e.id !== id)
            if (this.selected && this.selected.id === id) {
                this.selected = null
            }
            this.saveState()
        },

        connectRelationship(entityId) {
            const unconnectedRel = this.relationships.find(r => r.source.id === null || r.target.id === null)
            if (!unconnectedRel) {
                const newRel = new Relationship({
                    source: {id: entityId, port: null},
                })
                this.relationships.push(newRel)
                this.setSelected(newRel)
            } else {
                if (unconnectedRel.source.id === null) {
                    unconnectedRel.source.id = entityId
                } else {
                    unconnectedRel.target.id = entityId
                }
                this.setSelected(unconnectedRel)
                this.saveState()
            }
        },
        deleteRelationship(id) {
            this.relationships = this.relationships.filter(r => r.id !== id)
            if (this.selected && this.selected.id === id) {
                this.selected = null
            }
            this.saveState()
        },

        saveState() {
            const state = {
                entities: this.entities.map(e => e.toJSON()),
                relationships: this.relationships.map(r => r.toJSON())
            }
            localStorage.setItem('erDiagram', JSON.stringify(state))
        },
        loadState() {
            const saved = localStorage.getItem('erDiagram')
            if (saved) {
                try {
                    const state = JSON.parse(saved)
                    this.entities = state.entities.map(e => {
                        const entity = new Entity(e.id, e.name, e.x, e.y)
                        entity.attributes = e.attributes.map(a =>
                            new Attribute(a.id, a.name, a.type, a.isPrimaryKey)
                        )
                        return entity
                    })
                    this.relationships = state.relationships.map(r => new Relationship(r))
                } catch (error) {
                    console.error('Failed to load state:', error)
                    this.entities = []
                    this.relationships = []
                }
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
            this.entities = []
            this.relationships = []
            this.selected = null
            this.saveState()
        }
    }
})

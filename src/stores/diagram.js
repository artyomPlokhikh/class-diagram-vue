import { defineStore } from 'pinia'
import Entity from '@/models/Entity'
import Attribute from '@/models/Attribute'

export const useDiagramStore = defineStore('diagram', {
    state: () => ({
        entities: [],
        selectedEntity: null,
        draggingEntity: null,
        dragStartPos: { x: 0, y: 0 }
    }),
    actions: {
        addEntity(position) {
            const entity = new Entity(
                Date.now(),
                'New Entity',
                position.x,
                position.y
            )
            this.entities.push(entity)
            this.setSelectedEntity(entity)
            this.saveState()
        },

        deleteEntity(id) {
            this.entities = this.entities.filter(e => e.id !== id)
            this.saveState()
        },

        startDrag(entityId, startX, startY) {
            const entity = this.entities.find(e => e.id === entityId)
            if (entity) {
                this.draggingEntity = entity
                this.dragStartPos = { x: startX, y: startY }
            }
        },

        updateDragPosition(currentX, currentY) {
            if (!this.draggingEntity) return

            const dx = currentX - this.dragStartPos.x
            const dy = currentY - this.dragStartPos.y

            this.draggingEntity.x += dx
            this.draggingEntity.y += dy

            this.dragStartPos = { x: currentX, y: currentY }
        },

        stopDrag() {
            this.draggingEntity = null
            this.saveState()
        },

        setSelectedEntity(entity) {
            this.selectedEntity = entity
        },

        saveState() {
            const state = {
                entities: this.entities.map(e => e.toJSON()),
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

                } catch (error) {
                    console.error('Failed to load state:', error)
                    this.entities = []
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
        }
    }
})
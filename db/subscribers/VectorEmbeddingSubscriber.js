var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { EventSubscriber } from 'typeorm';
import { VectorEmbedding } from '../entities/VectorEmbedding.js';
/**
 * A subscriber to format vector embeddings before saving to database
 */
let VectorEmbeddingSubscriber = class VectorEmbeddingSubscriber {
    /**
     * Indicates that this subscriber only listens to VectorEmbedding events
     */
    listenTo() {
        return VectorEmbedding;
    }
    /**
     * Called before entity insertion
     */
    beforeInsert(event) {
        this.formatEmbedding(event.entity);
    }
    /**
     * Called before entity update
     */
    beforeUpdate(event) {
        if (event.entity && event.entity.embedding) {
            this.formatEmbedding(event.entity);
        }
    }
    /**
     * Format embedding as a proper vector string
     */
    formatEmbedding(entity) {
        if (!entity || !entity.embedding || !Array.isArray(entity.embedding)) {
            return;
        }
        // If the embedding is already a string, don't process it
        if (typeof entity.embedding === 'string') {
            return;
        }
        // Format array as proper pgvector string
        // Ensure the string starts with '[' and ends with ']' as required by pgvector
        const vectorString = `[${entity.embedding.join(',')}]`;
        // Store the string directly (TypeORM will handle conversion)
        // We need to use 'as any' because the type is declared as number[] but we're setting a string
        entity.embedding = vectorString;
    }
};
VectorEmbeddingSubscriber = __decorate([
    EventSubscriber()
], VectorEmbeddingSubscriber);
export { VectorEmbeddingSubscriber };
//# sourceMappingURL=VectorEmbeddingSubscriber.js.map
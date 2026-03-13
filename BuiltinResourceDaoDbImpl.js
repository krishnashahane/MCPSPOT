import { BuiltinResourceRepository } from '../db/repositories/BuiltinResourceRepository.js';
/**
 * Database-backed BuiltinResource DAO implementation.
 */
export class BuiltinResourceDaoDbImpl {
    constructor() {
        this.repository = new BuiltinResourceRepository();
    }
    toModel(entity) {
        return {
            id: entity.id,
            uri: entity.uri,
            name: entity.name,
            description: entity.description,
            mimeType: entity.mimeType,
            content: entity.content,
            enabled: entity.enabled,
        };
    }
    async findAll() {
        const entities = await this.repository.findAll();
        return entities.map((e) => this.toModel(e));
    }
    async findEnabled() {
        const entities = await this.repository.findEnabled();
        return entities.map((e) => this.toModel(e));
    }
    async findById(id) {
        const entity = await this.repository.findById(id);
        return entity ? this.toModel(entity) : null;
    }
    async findByUri(uri) {
        const entity = await this.repository.findByUri(uri);
        return entity ? this.toModel(entity) : null;
    }
    async create(data) {
        const existing = await this.repository.findByUri(data.uri);
        if (existing) {
            throw new Error(`Builtin resource with URI '${data.uri}' already exists`);
        }
        const entity = await this.repository.create({
            uri: data.uri,
            name: data.name,
            description: data.description,
            mimeType: data.mimeType,
            content: data.content,
            enabled: data.enabled ?? true,
        });
        return this.toModel(entity);
    }
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            return null;
        }
        if (data.uri && data.uri !== existing.uri) {
            const duplicate = await this.repository.findByUri(data.uri);
            if (duplicate) {
                throw new Error(`Builtin resource with URI '${data.uri}' already exists`);
            }
        }
        const updated = await this.repository.update(id, {
            uri: data.uri,
            name: data.name,
            description: data.description,
            mimeType: data.mimeType,
            content: data.content,
            enabled: data.enabled,
        });
        return updated ? this.toModel(updated) : null;
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
}
//# sourceMappingURL=BuiltinResourceDaoDbImpl.js.map
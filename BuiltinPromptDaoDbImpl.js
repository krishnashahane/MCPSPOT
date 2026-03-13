import { BuiltinPromptRepository } from '../db/repositories/BuiltinPromptRepository.js';
/**
 * Database-backed BuiltinPrompt DAO implementation.
 */
export class BuiltinPromptDaoDbImpl {
    constructor() {
        this.repository = new BuiltinPromptRepository();
    }
    toModel(entity) {
        return {
            id: entity.id,
            name: entity.name,
            title: entity.title,
            description: entity.description,
            template: entity.template,
            arguments: entity.arguments,
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
    async findByName(name) {
        const entity = await this.repository.findByName(name);
        return entity ? this.toModel(entity) : null;
    }
    async create(data) {
        const existing = await this.repository.findByName(data.name);
        if (existing) {
            throw new Error(`Builtin prompt with name '${data.name}' already exists`);
        }
        const entity = await this.repository.create({
            name: data.name,
            title: data.title,
            description: data.description,
            template: data.template,
            arguments: data.arguments,
            enabled: data.enabled ?? true,
        });
        return this.toModel(entity);
    }
    async update(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing) {
            return null;
        }
        if (data.name && data.name !== existing.name) {
            const duplicate = await this.repository.findByName(data.name);
            if (duplicate) {
                throw new Error(`Builtin prompt with name '${data.name}' already exists`);
            }
        }
        const updated = await this.repository.update(id, {
            name: data.name,
            title: data.title,
            description: data.description,
            template: data.template,
            arguments: data.arguments,
            enabled: data.enabled,
        });
        return updated ? this.toModel(updated) : null;
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
}
//# sourceMappingURL=BuiltinPromptDaoDbImpl.js.map
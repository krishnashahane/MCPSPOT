import { BearerKeyRepository } from '../db/repositories/BearerKeyRepository.js';
/**
 * Database-backed implementation of BearerKeyDao
 */
export class BearerKeyDaoDbImpl {
    constructor() {
        this.repository = new BearerKeyRepository();
    }
    toModel(entity) {
        return {
            id: entity.id,
            name: entity.name,
            token: entity.token,
            enabled: entity.enabled,
            accessType: entity.accessType,
            allowedGroups: entity.allowedGroups ?? [],
            allowedServers: entity.allowedServers ?? [],
        };
    }
    async findAll() {
        const entities = await this.repository.findAll();
        return entities.map((e) => this.toModel(e));
    }
    async findEnabled() {
        const entities = await this.repository.findAll();
        return entities.filter((e) => e.enabled).map((e) => this.toModel(e));
    }
    async findById(id) {
        const entity = await this.repository.findById(id);
        return entity ? this.toModel(entity) : undefined;
    }
    async findByToken(token) {
        const entity = await this.repository.findByToken(token);
        return entity ? this.toModel(entity) : undefined;
    }
    async create(data) {
        const entity = await this.repository.create({
            name: data.name,
            token: data.token,
            enabled: data.enabled,
            accessType: data.accessType,
            allowedGroups: data.allowedGroups ?? [],
            allowedServers: data.allowedServers ?? [],
        });
        return this.toModel(entity);
    }
    async update(id, data) {
        const entity = await this.repository.update(id, {
            name: data.name,
            token: data.token,
            enabled: data.enabled,
            accessType: data.accessType,
            allowedGroups: data.allowedGroups,
            allowedServers: data.allowedServers,
        });
        return entity ? this.toModel(entity) : null;
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
    async updateServerName(oldName, newName) {
        const allKeys = await this.repository.findAll();
        let updatedCount = 0;
        for (const key of allKeys) {
            let updated = false;
            if (key.allowedServers && key.allowedServers.length > 0) {
                const newServers = key.allowedServers.map((server) => {
                    if (server === oldName) {
                        updated = true;
                        return newName;
                    }
                    return server;
                });
                if (updated) {
                    await this.repository.update(key.id, { allowedServers: newServers });
                    updatedCount++;
                }
            }
        }
        return updatedCount;
    }
}
//# sourceMappingURL=BearerKeyDaoDbImpl.js.map
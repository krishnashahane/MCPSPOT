import { GroupRepository } from '../db/repositories/GroupRepository.js';
/**
 * Database-backed implementation of GroupDao
 */
export class GroupDaoDbImpl {
    constructor() {
        this.repository = new GroupRepository();
    }
    async findAll() {
        const groups = await this.repository.findAll();
        return groups.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            servers: g.servers,
            owner: g.owner,
        }));
    }
    async findById(id) {
        const group = await this.repository.findById(id);
        if (!group)
            return null;
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            servers: group.servers,
            owner: group.owner,
        };
    }
    async create(entity) {
        const group = await this.repository.create({
            name: entity.name,
            description: entity.description,
            servers: entity.servers,
            owner: entity.owner,
        });
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            servers: group.servers,
            owner: group.owner,
        };
    }
    async update(id, entity) {
        const group = await this.repository.update(id, {
            name: entity.name,
            description: entity.description,
            servers: entity.servers,
            owner: entity.owner,
        });
        if (!group)
            return null;
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            servers: group.servers,
            owner: group.owner,
        };
    }
    async delete(id) {
        return await this.repository.delete(id);
    }
    async exists(id) {
        return await this.repository.exists(id);
    }
    async count() {
        return await this.repository.count();
    }
    async findByOwner(owner) {
        const groups = await this.repository.findByOwner(owner);
        return groups.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            servers: g.servers,
            owner: g.owner,
        }));
    }
    async findByServer(serverName) {
        const allGroups = await this.repository.findAll();
        return allGroups
            .filter((g) => g.servers.some((s) => (typeof s === 'string' ? s === serverName : s.name === serverName)))
            .map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            servers: g.servers,
            owner: g.owner,
        }));
    }
    async addServerToGroup(groupId, serverName) {
        const group = await this.repository.findById(groupId);
        if (!group)
            return false;
        // Check if server already exists
        const serverExists = group.servers.some((s) => typeof s === 'string' ? s === serverName : s.name === serverName);
        if (!serverExists) {
            group.servers.push(serverName);
            await this.update(groupId, { servers: group.servers });
        }
        return true;
    }
    async removeServerFromGroup(groupId, serverName) {
        const group = await this.repository.findById(groupId);
        if (!group)
            return false;
        group.servers = group.servers.filter((s) => typeof s === 'string' ? s !== serverName : s.name !== serverName);
        await this.update(groupId, { servers: group.servers });
        return true;
    }
    async updateServers(groupId, servers) {
        const result = await this.update(groupId, { servers: servers });
        return result !== null;
    }
    async findByName(name) {
        const group = await this.repository.findByName(name);
        if (!group)
            return null;
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            servers: group.servers,
            owner: group.owner,
        };
    }
    async updateServerName(oldName, newName) {
        const allGroups = await this.repository.findAll();
        let updatedCount = 0;
        for (const group of allGroups) {
            let updated = false;
            const newServers = group.servers.map((server) => {
                if (typeof server === 'string') {
                    if (server === oldName) {
                        updated = true;
                        return newName;
                    }
                    return server;
                }
                else {
                    if (server.name === oldName) {
                        updated = true;
                        return { ...server, name: newName };
                    }
                    return server;
                }
            });
            if (updated) {
                await this.update(group.id, { servers: newServers });
                updatedCount++;
            }
        }
        return updatedCount;
    }
}
//# sourceMappingURL=GroupDaoDbImpl.js.map
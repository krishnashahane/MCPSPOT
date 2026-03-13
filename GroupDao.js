import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
import { v4 as uuidv4 } from 'uuid';
/**
 * JSON file-based Group DAO implementation
 */
export class GroupDaoImpl extends JsonFileBaseDao {
    async getAll() {
        const settings = await this.loadSettings();
        return settings.groups || [];
    }
    async saveAll(groups) {
        const settings = await this.loadSettings();
        settings.groups = groups;
        await this.saveSettings(settings);
    }
    getEntityId(group) {
        return group.id;
    }
    createEntity(data) {
        return {
            id: uuidv4(),
            owner: 'admin', // Default owner
            ...data,
            servers: data.servers || [],
        };
    }
    updateEntity(existing, updates) {
        return {
            ...existing,
            ...updates,
            id: existing.id, // ID should not be updated
        };
    }
    async findAll() {
        return this.getAll();
    }
    async findById(id) {
        const groups = await this.getAll();
        return groups.find((group) => group.id === id) || null;
    }
    async create(data) {
        const groups = await this.getAll();
        // Check if group name already exists
        if (groups.find((group) => group.name === data.name)) {
            throw new Error(`Group with name ${data.name} already exists`);
        }
        const newGroup = this.createEntity(data);
        groups.push(newGroup);
        await this.saveAll(groups);
        return newGroup;
    }
    async update(id, updates) {
        const groups = await this.getAll();
        const index = groups.findIndex((group) => group.id === id);
        if (index === -1) {
            return null;
        }
        // Check if name update would cause conflict
        if (updates.name && updates.name !== groups[index].name) {
            const existingGroup = groups.find((group) => group.name === updates.name && group.id !== id);
            if (existingGroup) {
                throw new Error(`Group with name ${updates.name} already exists`);
            }
        }
        // Don't allow ID changes
        const { id: _, ...allowedUpdates } = updates;
        const updatedGroup = this.updateEntity(groups[index], allowedUpdates);
        groups[index] = updatedGroup;
        await this.saveAll(groups);
        return updatedGroup;
    }
    async delete(id) {
        const groups = await this.getAll();
        const index = groups.findIndex((group) => group.id === id);
        if (index === -1) {
            return false;
        }
        groups.splice(index, 1);
        await this.saveAll(groups);
        return true;
    }
    async exists(id) {
        const group = await this.findById(id);
        return group !== null;
    }
    async count() {
        const groups = await this.getAll();
        return groups.length;
    }
    async findByOwner(owner) {
        const groups = await this.getAll();
        return groups.filter((group) => group.owner === owner);
    }
    async findByServer(serverName) {
        const groups = await this.getAll();
        return groups.filter((group) => {
            if (Array.isArray(group.servers)) {
                return group.servers.some((server) => {
                    if (typeof server === 'string') {
                        return server === serverName;
                    }
                    else {
                        return server.name === serverName;
                    }
                });
            }
            return false;
        });
    }
    async addServerToGroup(groupId, serverName) {
        const group = await this.findById(groupId);
        if (!group) {
            return false;
        }
        // Check if server already exists in group
        const serverExists = group.servers.some((server) => {
            if (typeof server === 'string') {
                return server === serverName;
            }
            else {
                return server.name === serverName;
            }
        });
        if (serverExists) {
            return true; // Already exists, consider it success
        }
        const updatedServers = [...group.servers, serverName];
        const result = await this.update(groupId, { servers: updatedServers });
        return result !== null;
    }
    async removeServerFromGroup(groupId, serverName) {
        const group = await this.findById(groupId);
        if (!group) {
            return false;
        }
        const updatedServers = group.servers.filter((server) => {
            if (typeof server === 'string') {
                return server !== serverName;
            }
            else {
                return server.name !== serverName;
            }
        });
        const result = await this.update(groupId, { servers: updatedServers });
        return result !== null;
    }
    async updateServers(groupId, servers) {
        const result = await this.update(groupId, { servers });
        return result !== null;
    }
    async findByName(name) {
        const groups = await this.getAll();
        return groups.find((group) => group.name === name) || null;
    }
    async updateServerName(oldName, newName) {
        const groups = await this.getAll();
        let updatedCount = 0;
        for (const group of groups) {
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
                group.servers = newServers;
                updatedCount++;
            }
        }
        if (updatedCount > 0) {
            await this.saveAll(groups);
        }
        return updatedCount;
    }
}
//# sourceMappingURL=GroupDao.js.map
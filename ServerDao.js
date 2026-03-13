import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based Server DAO implementation
 */
export class ServerDaoImpl extends JsonFileBaseDao {
    async getAll() {
        const settings = await this.loadSettings();
        const servers = [];
        for (const [name, config] of Object.entries(settings.mcpServers || {})) {
            servers.push({
                name,
                ...config,
            });
        }
        return servers;
    }
    async saveAll(servers) {
        const settings = await this.loadSettings();
        settings.mcpServers = {};
        for (const server of servers) {
            const { name, ...config } = server;
            settings.mcpServers[name] = config;
        }
        await this.saveSettings(settings);
    }
    getEntityId(server) {
        return server.name;
    }
    createEntity(_data) {
        throw new Error('Server name must be provided');
    }
    updateEntity(existing, updates) {
        return {
            ...existing,
            ...updates,
            // Keep the existing name unless explicitly updating via rename
            name: updates.name ?? existing.name,
        };
    }
    async findAll() {
        return this.getAll();
    }
    async findById(name) {
        const servers = await this.getAll();
        return servers.find((server) => server.name === name) || null;
    }
    async create(data) {
        const servers = await this.getAll();
        // Check if server already exists
        if (servers.find((server) => server.name === data.name)) {
            throw new Error(`Server ${data.name} already exists`);
        }
        const newServer = {
            enabled: true, // Default to enabled
            owner: 'admin', // Default owner
            ...data,
        };
        servers.push(newServer);
        await this.saveAll(servers);
        return newServer;
    }
    async update(name, updates) {
        const servers = await this.getAll();
        const index = servers.findIndex((server) => server.name === name);
        if (index === -1) {
            return null;
        }
        const updatedServer = this.updateEntity(servers[index], updates);
        servers[index] = updatedServer;
        await this.saveAll(servers);
        return updatedServer;
    }
    async delete(name) {
        const servers = await this.getAll();
        const index = servers.findIndex((server) => server.name === name);
        if (index === -1) {
            return false;
        }
        servers.splice(index, 1);
        await this.saveAll(servers);
        return true;
    }
    async exists(name) {
        const server = await this.findById(name);
        return server !== null;
    }
    async count() {
        const servers = await this.getAll();
        return servers.length;
    }
    async findAllPaginated(page, limit) {
        const allServers = await this.getAll();
        // Sort: enabled servers first, then by creation time
        const sortedServers = allServers.sort((a, b) => {
            const aEnabled = a.enabled !== false;
            const bEnabled = b.enabled !== false;
            if (aEnabled !== bEnabled) {
                return aEnabled ? -1 : 1;
            }
            return 0; // Keep original order for same enabled status
        });
        const total = sortedServers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const data = sortedServers.slice(startIndex, endIndex);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findByOwnerPaginated(owner, page, limit) {
        const allServers = await this.getAll();
        const filteredServers = allServers.filter((server) => server.owner === owner);
        // Sort: enabled servers first, then by creation time
        const sortedServers = filteredServers.sort((a, b) => {
            const aEnabled = a.enabled !== false;
            const bEnabled = b.enabled !== false;
            if (aEnabled !== bEnabled) {
                return aEnabled ? -1 : 1;
            }
            return 0; // Keep original order for same enabled status
        });
        const total = sortedServers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const data = sortedServers.slice(startIndex, endIndex);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findByOwner(owner) {
        const servers = await this.getAll();
        return servers.filter((server) => server.owner === owner);
    }
    async findEnabled() {
        const servers = await this.getAll();
        return servers.filter((server) => server.enabled !== false);
    }
    async findByType(type) {
        const servers = await this.getAll();
        return servers.filter((server) => server.type === type);
    }
    async setEnabled(name, enabled) {
        const result = await this.update(name, { enabled });
        return result !== null;
    }
    async updateTools(name, tools) {
        const result = await this.update(name, { tools });
        return result !== null;
    }
    async updatePrompts(name, prompts) {
        const result = await this.update(name, { prompts });
        return result !== null;
    }
    async updateResources(name, resources) {
        const result = await this.update(name, { resources });
        return result !== null;
    }
    async rename(oldName, newName) {
        const servers = await this.getAll();
        const index = servers.findIndex((server) => server.name === oldName);
        if (index === -1) {
            return false;
        }
        // Check if newName already exists
        if (servers.find((server) => server.name === newName)) {
            throw new Error(`Server ${newName} already exists`);
        }
        servers[index] = { ...servers[index], name: newName };
        await this.saveAll(servers);
        return true;
    }
}
//# sourceMappingURL=ServerDao.js.map
import { ServerRepository } from '../db/repositories/ServerRepository.js';
/**
 * Database-backed implementation of ServerDao
 */
export class ServerDaoDbImpl {
    constructor() {
        this.repository = new ServerRepository();
    }
    async findAll() {
        const servers = await this.repository.findAll();
        return servers.map((s) => this.mapToServerConfig(s));
    }
    async findAllPaginated(page, limit) {
        const { data, total } = await this.repository.findAllPaginated(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: data.map((s) => this.mapToServerConfig(s)),
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findByOwnerPaginated(owner, page, limit) {
        const { data, total } = await this.repository.findByOwnerPaginated(owner, page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: data.map((s) => this.mapToServerConfig(s)),
            total,
            page,
            limit,
            totalPages,
        };
    }
    async findById(name) {
        const server = await this.repository.findByName(name);
        return server ? this.mapToServerConfig(server) : null;
    }
    async create(entity) {
        const server = await this.repository.create({
            name: entity.name,
            type: entity.type,
            description: entity.description,
            url: entity.url,
            command: entity.command,
            args: entity.args,
            env: entity.env,
            headers: entity.headers,
            enabled: entity.enabled !== undefined ? entity.enabled : true,
            owner: entity.owner,
            enableKeepAlive: entity.enableKeepAlive,
            keepAliveInterval: entity.keepAliveInterval,
            tools: entity.tools,
            prompts: entity.prompts,
            resources: entity.resources,
            options: entity.options,
            oauth: entity.oauth,
            proxy: entity.proxy,
            openapi: entity.openapi,
        });
        return this.mapToServerConfig(server);
    }
    async update(name, entity) {
        const server = await this.repository.update(name, {
            type: entity.type,
            description: entity.description,
            url: entity.url,
            command: entity.command,
            args: entity.args,
            env: entity.env,
            headers: entity.headers,
            enabled: entity.enabled,
            owner: entity.owner,
            enableKeepAlive: entity.enableKeepAlive,
            keepAliveInterval: entity.keepAliveInterval,
            tools: entity.tools,
            prompts: entity.prompts,
            resources: entity.resources,
            options: entity.options,
            oauth: entity.oauth,
            proxy: entity.proxy,
            openapi: entity.openapi,
        });
        return server ? this.mapToServerConfig(server) : null;
    }
    async delete(name) {
        return await this.repository.delete(name);
    }
    async exists(name) {
        return await this.repository.exists(name);
    }
    async count() {
        return await this.repository.count();
    }
    async findByOwner(owner) {
        const servers = await this.repository.findByOwner(owner);
        return servers.map((s) => this.mapToServerConfig(s));
    }
    async findEnabled() {
        const servers = await this.repository.findEnabled();
        return servers.map((s) => this.mapToServerConfig(s));
    }
    async findByType(type) {
        const allServers = await this.repository.findAll();
        return allServers.filter((s) => s.type === type).map((s) => this.mapToServerConfig(s));
    }
    async setEnabled(name, enabled) {
        const server = await this.repository.setEnabled(name, enabled);
        return server !== null;
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
        // Check if newName already exists
        if (await this.repository.exists(newName)) {
            throw new Error(`Server ${newName} already exists`);
        }
        return await this.repository.rename(oldName, newName);
    }
    mapToServerConfig(server) {
        return {
            name: server.name,
            type: server.type,
            description: server.description,
            url: server.url,
            command: server.command,
            args: server.args,
            env: server.env,
            headers: server.headers,
            enabled: server.enabled,
            owner: server.owner,
            enableKeepAlive: server.enableKeepAlive,
            keepAliveInterval: server.keepAliveInterval,
            tools: server.tools,
            prompts: server.prompts,
            resources: server.resources,
            options: server.options,
            oauth: server.oauth,
            proxy: server.proxy,
            openapi: server.openapi,
        };
    }
}
//# sourceMappingURL=ServerDaoDbImpl.js.map
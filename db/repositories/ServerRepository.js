import { Server } from '../entities/Server.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for Server entity
 */
export class ServerRepository {
    constructor() {
        this.repository = getAppDataSource().getRepository(Server);
    }
    /**
     * Find all servers
     */
    async findAll() {
        return await this.repository.find({ order: { createdAt: 'ASC' } });
    }
    /**
     * Find server by name
     */
    async findByName(name) {
        return await this.repository.findOne({ where: { name } });
    }
    /**
     * Create a new server
     */
    async create(server) {
        const newServer = this.repository.create(server);
        return await this.repository.save(newServer);
    }
    /**
     * Update an existing server
     */
    async update(name, serverData) {
        const server = await this.findByName(name);
        if (!server) {
            return null;
        }
        const updated = this.repository.merge(server, serverData);
        return await this.repository.save(updated);
    }
    /**
     * Delete a server
     */
    async delete(name) {
        const result = await this.repository.delete({ name });
        return (result.affected ?? 0) > 0;
    }
    /**
     * Check if server exists
     */
    async exists(name) {
        const count = await this.repository.count({ where: { name } });
        return count > 0;
    }
    /**
     * Count total servers
     */
    async count() {
        return await this.repository.count();
    }
    /**
     * Find servers with pagination
     */
    async findAllPaginated(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.repository.findAndCount({
            order: {
                enabled: 'DESC', // Enabled servers first
                createdAt: 'ASC' // Then by creation time
            },
            skip,
            take: limit,
        });
        return { data, total };
    }
    /**
     * Find servers by owner with pagination
     */
    async findByOwnerPaginated(owner, page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.repository.findAndCount({
            where: { owner },
            order: {
                enabled: 'DESC', // Enabled servers first
                createdAt: 'ASC' // Then by creation time
            },
            skip,
            take: limit,
        });
        return { data, total };
    }
    /**
     * Find servers by owner
     */
    async findByOwner(owner) {
        return await this.repository.find({ where: { owner }, order: { createdAt: 'ASC' } });
    }
    /**
     * Find enabled servers
     */
    async findEnabled() {
        return await this.repository.find({ where: { enabled: true }, order: { createdAt: 'ASC' } });
    }
    /**
     * Set server enabled status
     */
    async setEnabled(name, enabled) {
        return await this.update(name, { enabled });
    }
    /**
     * Rename a server
     */
    async rename(oldName, newName) {
        const server = await this.findByName(oldName);
        if (!server) {
            return false;
        }
        server.name = newName;
        await this.repository.save(server);
        return true;
    }
}
export default ServerRepository;
//# sourceMappingURL=ServerRepository.js.map
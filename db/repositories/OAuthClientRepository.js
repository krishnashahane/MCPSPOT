import { OAuthClient } from '../entities/OAuthClient.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for OAuthClient entity
 */
export class OAuthClientRepository {
    constructor() {
        this.repository = getAppDataSource().getRepository(OAuthClient);
    }
    /**
     * Find all OAuth clients
     */
    async findAll() {
        return await this.repository.find();
    }
    /**
     * Find OAuth client by client ID
     */
    async findByClientId(clientId) {
        return await this.repository.findOne({ where: { clientId } });
    }
    /**
     * Find OAuth clients by owner
     */
    async findByOwner(owner) {
        return await this.repository.find({ where: { owner } });
    }
    /**
     * Create a new OAuth client
     */
    async create(client) {
        const newClient = this.repository.create(client);
        return await this.repository.save(newClient);
    }
    /**
     * Update an existing OAuth client
     */
    async update(clientId, clientData) {
        const client = await this.findByClientId(clientId);
        if (!client) {
            return null;
        }
        const updated = this.repository.merge(client, clientData);
        return await this.repository.save(updated);
    }
    /**
     * Delete an OAuth client
     */
    async delete(clientId) {
        const result = await this.repository.delete({ clientId });
        return (result.affected ?? 0) > 0;
    }
    /**
     * Check if OAuth client exists
     */
    async exists(clientId) {
        const count = await this.repository.count({ where: { clientId } });
        return count > 0;
    }
    /**
     * Count total OAuth clients
     */
    async count() {
        return await this.repository.count();
    }
}
export default OAuthClientRepository;
//# sourceMappingURL=OAuthClientRepository.js.map
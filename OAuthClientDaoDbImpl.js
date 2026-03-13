import { OAuthClientRepository } from '../db/repositories/OAuthClientRepository.js';
/**
 * Database-backed implementation of OAuthClientDao
 */
export class OAuthClientDaoDbImpl {
    constructor() {
        this.repository = new OAuthClientRepository();
    }
    async findAll() {
        const clients = await this.repository.findAll();
        return clients.map((c) => this.mapToOAuthClient(c));
    }
    async findById(clientId) {
        const client = await this.repository.findByClientId(clientId);
        return client ? this.mapToOAuthClient(client) : null;
    }
    async findByClientId(clientId) {
        return this.findById(clientId);
    }
    async findByOwner(owner) {
        const clients = await this.repository.findByOwner(owner);
        return clients.map((c) => this.mapToOAuthClient(c));
    }
    async create(entity) {
        const client = await this.repository.create({
            clientId: entity.clientId,
            clientSecret: entity.clientSecret,
            name: entity.name,
            redirectUris: entity.redirectUris,
            grants: entity.grants,
            scopes: entity.scopes,
            owner: entity.owner || 'admin',
            metadata: entity.metadata,
        });
        return this.mapToOAuthClient(client);
    }
    async update(clientId, entity) {
        const client = await this.repository.update(clientId, {
            clientSecret: entity.clientSecret,
            name: entity.name,
            redirectUris: entity.redirectUris,
            grants: entity.grants,
            scopes: entity.scopes,
            owner: entity.owner,
            metadata: entity.metadata,
        });
        return client ? this.mapToOAuthClient(client) : null;
    }
    async delete(clientId) {
        return await this.repository.delete(clientId);
    }
    async exists(clientId) {
        return await this.repository.exists(clientId);
    }
    async count() {
        return await this.repository.count();
    }
    async validateCredentials(clientId, clientSecret) {
        const client = await this.findByClientId(clientId);
        if (!client) {
            return false;
        }
        // If client has no secret (public client), accept if no secret provided
        if (!client.clientSecret) {
            return !clientSecret;
        }
        // If client has a secret, it must match
        return client.clientSecret === clientSecret;
    }
    mapToOAuthClient(client) {
        return {
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            name: client.name,
            redirectUris: client.redirectUris,
            grants: client.grants,
            scopes: client.scopes,
            owner: client.owner,
            metadata: client.metadata,
        };
    }
}
//# sourceMappingURL=OAuthClientDaoDbImpl.js.map
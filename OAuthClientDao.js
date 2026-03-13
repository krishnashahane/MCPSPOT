import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based OAuth Client DAO implementation
 */
export class OAuthClientDaoImpl extends JsonFileBaseDao {
    async getAll() {
        const settings = await this.loadSettings();
        return settings.oauthClients || [];
    }
    async saveAll(clients) {
        const settings = await this.loadSettings();
        settings.oauthClients = clients;
        await this.saveSettings(settings);
    }
    getEntityId(client) {
        return client.clientId;
    }
    createEntity(_data) {
        throw new Error('clientId must be provided');
    }
    updateEntity(existing, updates) {
        return {
            ...existing,
            ...updates,
            clientId: existing.clientId, // clientId should not be updated
        };
    }
    async findAll() {
        return this.getAll();
    }
    async findById(clientId) {
        return this.findByClientId(clientId);
    }
    async findByClientId(clientId) {
        const clients = await this.getAll();
        return clients.find((client) => client.clientId === clientId) || null;
    }
    async findByOwner(owner) {
        const clients = await this.getAll();
        return clients.filter((client) => client.owner === owner);
    }
    async create(data) {
        const clients = await this.getAll();
        // Check if client already exists
        if (clients.find((client) => client.clientId === data.clientId)) {
            throw new Error(`OAuth client ${data.clientId} already exists`);
        }
        const newClient = {
            ...data,
            owner: data.owner || 'admin',
        };
        clients.push(newClient);
        await this.saveAll(clients);
        return newClient;
    }
    async update(clientId, updates) {
        const clients = await this.getAll();
        const index = clients.findIndex((client) => client.clientId === clientId);
        if (index === -1) {
            return null;
        }
        // Don't allow clientId changes
        const { clientId: _, ...allowedUpdates } = updates;
        const updatedClient = this.updateEntity(clients[index], allowedUpdates);
        clients[index] = updatedClient;
        await this.saveAll(clients);
        return updatedClient;
    }
    async delete(clientId) {
        const clients = await this.getAll();
        const index = clients.findIndex((client) => client.clientId === clientId);
        if (index === -1) {
            return false;
        }
        clients.splice(index, 1);
        await this.saveAll(clients);
        return true;
    }
    async exists(clientId) {
        const client = await this.findByClientId(clientId);
        return client !== null;
    }
    async count() {
        const clients = await this.getAll();
        return clients.length;
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
}
//# sourceMappingURL=OAuthClientDao.js.map
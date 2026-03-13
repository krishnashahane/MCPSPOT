import { randomUUID } from 'node:crypto';
import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based BearerKey DAO implementation
 * Stores keys under the top-level `bearerKeys` field in mcp_settings.json
 * and performs one-time migration from legacy routing.enableBearerAuth/bearerAuthKey.
 */
export class BearerKeyDaoImpl extends JsonFileBaseDao {
    async loadKeysWithMigration() {
        const settings = await this.loadSettings();
        // Treat an existing array (including an empty array) as already migrated.
        // Otherwise, when there are no configured keys, we'd rewrite mcp_settings.json
        // on every request, which also clears the global settings cache.
        if (Array.isArray(settings.bearerKeys)) {
            return settings.bearerKeys;
        }
        // Perform one-time migration from legacy routing config if present
        const routing = settings.systemConfig?.routing || {};
        const enableBearerAuth = !!routing.enableBearerAuth;
        const rawKey = (routing.bearerAuthKey || '').trim();
        let migrated = [];
        if (rawKey) {
            // Cases 2 and 3 in migration rules
            migrated = [
                {
                    id: randomUUID(),
                    name: 'default',
                    token: rawKey,
                    enabled: enableBearerAuth,
                    accessType: 'all',
                    allowedGroups: [],
                    allowedServers: [],
                },
            ];
        }
        // Cases 1 and 4 both result in empty keys list
        settings.bearerKeys = migrated;
        await this.saveSettings(settings);
        return migrated;
    }
    async saveKeys(keys) {
        const settings = await this.loadSettings();
        settings.bearerKeys = keys;
        await this.saveSettings(settings);
    }
    async findAll() {
        return await this.loadKeysWithMigration();
    }
    async findEnabled() {
        const keys = await this.loadKeysWithMigration();
        return keys.filter((key) => key.enabled);
    }
    async findById(id) {
        const keys = await this.loadKeysWithMigration();
        return keys.find((key) => key.id === id);
    }
    async findByToken(token) {
        const keys = await this.loadKeysWithMigration();
        return keys.find((key) => key.token === token);
    }
    async create(data) {
        const keys = await this.loadKeysWithMigration();
        const newKey = {
            id: randomUUID(),
            ...data,
        };
        keys.push(newKey);
        await this.saveKeys(keys);
        return newKey;
    }
    async update(id, data) {
        const keys = await this.loadKeysWithMigration();
        const index = keys.findIndex((key) => key.id === id);
        if (index === -1) {
            return null;
        }
        const updated = {
            ...keys[index],
            ...data,
            id: keys[index].id,
        };
        keys[index] = updated;
        await this.saveKeys(keys);
        return updated;
    }
    async delete(id) {
        const keys = await this.loadKeysWithMigration();
        const next = keys.filter((key) => key.id !== id);
        if (next.length === keys.length) {
            return false;
        }
        await this.saveKeys(next);
        return true;
    }
    async updateServerName(oldName, newName) {
        const keys = await this.loadKeysWithMigration();
        let updatedCount = 0;
        for (const key of keys) {
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
                    key.allowedServers = newServers;
                    updatedCount++;
                }
            }
        }
        if (updatedCount > 0) {
            await this.saveKeys(keys);
        }
        return updatedCount;
    }
}
//# sourceMappingURL=BearerKeyDao.js.map
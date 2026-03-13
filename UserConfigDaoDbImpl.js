import { UserConfigRepository } from '../db/repositories/UserConfigRepository.js';
/**
 * Database-backed implementation of UserConfigDao
 */
export class UserConfigDaoDbImpl {
    constructor() {
        this.repository = new UserConfigRepository();
    }
    async getAll() {
        const configs = await this.repository.getAll();
        const result = {};
        for (const [username, config] of Object.entries(configs)) {
            result[username] = {
                routing: config.routing,
                ...config.additionalConfig,
            };
        }
        return result;
    }
    async get(username) {
        const config = await this.repository.get(username);
        if (!config) {
            return { routing: {} };
        }
        return {
            routing: config.routing,
            ...config.additionalConfig,
        };
    }
    async update(username, config) {
        const { routing, ...additionalConfig } = config;
        const updated = await this.repository.update(username, {
            routing,
            additionalConfig,
        });
        return {
            routing: updated.routing,
            ...updated.additionalConfig,
        };
    }
    async delete(username) {
        return await this.repository.delete(username);
    }
    async getSection(username, section) {
        const config = await this.get(username);
        return config[section];
    }
    async updateSection(username, section, value) {
        await this.update(username, { [section]: value });
        return true;
    }
    async exists(username) {
        const config = await this.repository.get(username);
        return config !== null;
    }
    async reset(username) {
        await this.repository.delete(username);
        return { routing: {} };
    }
}
//# sourceMappingURL=UserConfigDaoDbImpl.js.map
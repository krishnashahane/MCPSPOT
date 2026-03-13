import { UserConfig } from '../entities/UserConfig.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for UserConfig entity
 */
export class UserConfigRepository {
    constructor() {
        this.repository = getAppDataSource().getRepository(UserConfig);
    }
    /**
     * Get all user configs
     */
    async getAll() {
        const configs = await this.repository.find();
        const result = {};
        for (const config of configs) {
            result[config.username] = config;
        }
        return result;
    }
    /**
     * Get user config by username
     */
    async get(username) {
        return await this.repository.findOne({ where: { username } });
    }
    /**
     * Update user config
     */
    async update(username, configData) {
        let config = await this.get(username);
        if (!config) {
            // Create new config if doesn't exist
            config = this.repository.create({
                username,
                routing: {},
                additionalConfig: {},
                ...configData,
            });
        }
        else {
            // Merge with existing config
            config = this.repository.merge(config, configData);
        }
        return await this.repository.save(config);
    }
    /**
     * Delete user config
     */
    async delete(username) {
        const result = await this.repository.delete({ username });
        return (result.affected ?? 0) > 0;
    }
    /**
     * Get a specific configuration section for a user
     */
    async getSection(username, section) {
        const config = await this.get(username);
        return config ? config[section] : null;
    }
    /**
     * Update a specific configuration section for a user
     */
    async updateSection(username, section, value) {
        return await this.update(username, { [section]: value });
    }
}
export default UserConfigRepository;
//# sourceMappingURL=UserConfigRepository.js.map
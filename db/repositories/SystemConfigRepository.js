import { SystemConfig } from '../entities/SystemConfig.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for SystemConfig entity
 * Uses singleton pattern with id = 'default'
 */
export class SystemConfigRepository {
    constructor() {
        this.DEFAULT_ID = 'default';
        this.repository = getAppDataSource().getRepository(SystemConfig);
    }
    /**
     * Get system configuration (singleton)
     */
    async get() {
        let config = await this.repository.findOne({ where: { id: this.DEFAULT_ID } });
        // Create default if doesn't exist
        if (!config) {
            config = this.repository.create({
                id: this.DEFAULT_ID,
                routing: {},
                install: {},
                smartRouting: {},
                mcpRouter: {},
                nameSeparator: '-',
                oauth: {},
                oauthServer: {},
                auth: {},
                enableSessionRebuild: false,
            });
            config = await this.repository.save(config);
        }
        return config;
    }
    /**
     * Update system configuration
     */
    async update(configData) {
        const config = await this.get();
        const updated = this.repository.merge(config, configData);
        return await this.repository.save(updated);
    }
    /**
     * Reset system configuration to defaults
     */
    async reset() {
        await this.repository.delete({ id: this.DEFAULT_ID });
        return await this.get();
    }
    /**
     * Get a specific configuration section
     */
    async getSection(section) {
        const config = await this.get();
        return config[section];
    }
    /**
     * Update a specific configuration section
     */
    async updateSection(section, value) {
        return await this.update({ [section]: value });
    }
}
export default SystemConfigRepository;
//# sourceMappingURL=SystemConfigRepository.js.map
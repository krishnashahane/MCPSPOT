import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based System Configuration DAO implementation
 */
export class SystemConfigDaoImpl extends JsonFileBaseDao {
    async get() {
        const settings = await this.loadSettings();
        return settings.systemConfig || {};
    }
    async update(config) {
        const settings = await this.loadSettings();
        const currentConfig = settings.systemConfig || {};
        // Deep merge configuration
        const updatedConfig = this.deepMerge(currentConfig, config);
        settings.systemConfig = updatedConfig;
        await this.saveSettings(settings);
        return updatedConfig;
    }
    async reset() {
        const settings = await this.loadSettings();
        const defaultConfig = {};
        settings.systemConfig = defaultConfig;
        await this.saveSettings(settings);
        return defaultConfig;
    }
    async getSection(section) {
        const config = await this.get();
        return config[section];
    }
    async updateSection(section, value) {
        try {
            await this.update({ [section]: value });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Deep merge two objects
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
        return result;
    }
}
//# sourceMappingURL=SystemConfigDao.js.map
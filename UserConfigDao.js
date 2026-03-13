import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based User Configuration DAO implementation
 */
export class UserConfigDaoImpl extends JsonFileBaseDao {
    async get(username) {
        const settings = await this.loadSettings();
        return settings.userConfigs?.[username];
    }
    async getAll() {
        const settings = await this.loadSettings();
        return settings.userConfigs || {};
    }
    async update(username, config) {
        const settings = await this.loadSettings();
        if (!settings.userConfigs) {
            settings.userConfigs = {};
        }
        const currentConfig = settings.userConfigs[username] || {};
        // Deep merge configuration
        const updatedConfig = this.deepMerge(currentConfig, config);
        settings.userConfigs[username] = updatedConfig;
        await this.saveSettings(settings);
        return updatedConfig;
    }
    async delete(username) {
        const settings = await this.loadSettings();
        if (!settings.userConfigs || !settings.userConfigs[username]) {
            return false;
        }
        delete settings.userConfigs[username];
        await this.saveSettings(settings);
        return true;
    }
    async exists(username) {
        const config = await this.get(username);
        return config !== undefined;
    }
    async reset(username) {
        const defaultConfig = {};
        return this.update(username, defaultConfig);
    }
    async getSection(username, section) {
        const config = await this.get(username);
        return config?.[section];
    }
    async updateSection(username, section, value) {
        try {
            await this.update(username, { [section]: value });
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
//# sourceMappingURL=UserConfigDao.js.map
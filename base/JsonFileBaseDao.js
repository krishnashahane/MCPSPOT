import fs from 'fs';
import path from 'path';
import { getSettingsPath, clearSettingsCache } from '../../config/index.js';
/**
 * Abstract base class for JSON file-based DAO implementations
 */
export class JsonFileBaseDao {
    constructor() {
        this.settingsCache = null;
        this.lastModified = 0;
    }
    /**
     * Load settings from JSON file with caching
     */
    async loadSettings() {
        try {
            const settingsPath = getSettingsPath();
            const stats = fs.statSync(settingsPath);
            const fileModified = stats.mtime.getTime();
            // Check if cache is still valid
            if (this.settingsCache && this.lastModified >= fileModified) {
                return this.settingsCache;
            }
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const settings = JSON.parse(settingsData);
            // Update cache
            this.settingsCache = settings;
            this.lastModified = fileModified;
            return settings;
        }
        catch (error) {
            console.error(`Failed to load settings:`, error);
            const defaultSettings = {
                mcpServers: {},
                users: [],
                groups: [],
                systemConfig: {},
                userConfigs: {},
            };
            // Cache default settings
            this.settingsCache = defaultSettings;
            this.lastModified = Date.now();
            return defaultSettings;
        }
    }
    /**
     * Save settings to JSON file and update cache
     */
    async saveSettings(settings) {
        try {
            // Ensure directory exists
            const settingsPath = getSettingsPath();
            const dir = path.dirname(settingsPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
            // Update cache
            this.settingsCache = settings;
            this.lastModified = Date.now();
            clearSettingsCache();
        }
        catch (error) {
            console.error(`Failed to save settings:`, error);
            throw error;
        }
    }
    /**
     * Clear settings cache
     */
    clearCache() {
        this.settingsCache = null;
        this.lastModified = 0;
        clearSettingsCache();
    }
    /**
     * Get cache status for debugging
     */
    getCacheInfo() {
        return {
            hasCache: this.settingsCache !== null,
            lastModified: this.lastModified,
        };
    }
}
//# sourceMappingURL=JsonFileBaseDao.js.map
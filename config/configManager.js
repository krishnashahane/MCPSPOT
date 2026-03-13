import dotenv from 'dotenv';
import { getPackageVersion } from '../utils/version.js';
import { getDataService } from '../services/services.js';
import { createDaoConfigService } from './DaoConfigService.js';
import { loadOriginalSettings as legacyLoadSettings, saveSettings as legacySaveSettings, clearSettingsCache as legacyClearCache, } from './index.js';
dotenv.config();
const defaultConfig = {
    port: process.env.PORT || 3000,
    initTimeout: process.env.INIT_TIMEOUT || 300000,
    basePath: process.env.BASE_PATH || '',
    readonly: 'true' === process.env.READONLY || false,
    mcpHubName: 'mcpspot',
    mcpHubVersion: getPackageVersion(),
};
// Configuration for which data access method to use
const USE_DAO_LAYER = process.env.USE_DAO_LAYER === 'true';
// Services
const dataService = getDataService();
const daoConfigService = createDaoConfigService();
/**
 * Load settings using either DAO layer or legacy file-based approach
 */
export const loadSettings = async (user) => {
    if (USE_DAO_LAYER) {
        console.log('Loading settings using DAO layer');
        return await daoConfigService.loadSettings(user);
    }
    else {
        console.log('Loading settings using legacy approach');
        const settings = legacyLoadSettings();
        return dataService.filterSettings(settings, user);
    }
};
/**
 * Save settings using either DAO layer or legacy file-based approach
 */
export const saveSettings = async (settings, user) => {
    if (USE_DAO_LAYER) {
        console.log('Saving settings using DAO layer');
        return await daoConfigService.saveSettings(settings, user);
    }
    else {
        console.log('Saving settings using legacy approach');
        const mergedSettings = dataService.mergeSettings(legacyLoadSettings(), settings, user);
        return legacySaveSettings(mergedSettings, user);
    }
};
/**
 * Clear settings cache
 */
export const clearSettingsCache = () => {
    if (USE_DAO_LAYER) {
        daoConfigService.clearCache();
    }
    else {
        legacyClearCache();
    }
};
/**
 * Get current cache status (for debugging)
 */
export const getSettingsCacheInfo = () => {
    if (USE_DAO_LAYER) {
        const daoInfo = daoConfigService.getCacheInfo();
        return {
            ...daoInfo,
            usingDao: true,
        };
    }
    else {
        return {
            hasCache: false, // Legacy method doesn't expose cache info here
            usingDao: false,
        };
    }
};
/**
 * Switch to DAO layer at runtime (for testing/migration purposes)
 */
export const switchToDao = () => {
    process.env.USE_DAO_LAYER = 'true';
};
/**
 * Switch to legacy file-based approach at runtime (for testing/rollback purposes)
 */
export const switchToLegacy = () => {
    process.env.USE_DAO_LAYER = 'false';
};
/**
 * Get DAO config service for direct access
 */
export const getDaoConfigService = () => {
    return daoConfigService;
};
/**
 * Migration utility to migrate from legacy format to DAO layer
 */
export const migrateToDao = async () => {
    try {
        console.log('Starting migration from legacy format to DAO layer...');
        // Load data using legacy method
        const legacySettings = legacyLoadSettings();
        // Save using DAO layer
        switchToDao();
        const success = await saveSettings(legacySettings);
        if (success) {
            console.log('Migration completed successfully');
            return true;
        }
        else {
            console.error('Migration failed during save operation');
            switchToLegacy();
            return false;
        }
    }
    catch (error) {
        console.error('Migration failed:', error);
        switchToLegacy();
        return false;
    }
};
export default defaultConfig;
//# sourceMappingURL=configManager.js.map
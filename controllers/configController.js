import config from '../config/index.js';
import { loadSettings } from '../config/index.js';
import { getDataService } from '../services/services.js';
import { getGroupDao, getOAuthClientDao, getOAuthTokenDao, getServerDao, getSystemConfigDao, getUserConfigDao, getUserDao, getBearerKeyDao, } from '../dao/DaoFactory.js';
import { getBetterAuthRuntimeConfig } from '../services/betterAuthConfig.js';
const dataService = getDataService();
/**
 * Get runtime configuration for frontend
 */
export const getRuntimeConfig = (req, res) => {
    try {
        const runtimeConfig = {
            basePath: config.basePath,
            version: config.mcpHubVersion,
            name: config.mcpHubName,
        };
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json({
            success: true,
            data: runtimeConfig,
        });
    }
    catch (error) {
        console.error('Error getting runtime config:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get runtime configuration',
        });
    }
};
/**
 * Get public system configuration (only skipAuth setting)
 * This endpoint doesn't require authentication to allow checking if dashboard login should be skipped
 */
export const getPublicConfig = (req, res) => {
    try {
        const settings = loadSettings();
        const skipAuth = settings.systemConfig?.routing?.skipAuth || false;
        let permissions = {};
        if (skipAuth) {
            const user = {
                username: 'guest',
                password: '',
                isAdmin: true,
            };
            permissions = dataService.getPermissions(user);
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json({
            success: true,
            data: {
                skipAuth,
                permissions,
                betterAuth: getBetterAuthRuntimeConfig(),
            },
        });
    }
    catch (error) {
        console.error('Error getting public config:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get public configuration',
        });
    }
};
/**
 * Recursively remove null values from an object
 */
const removeNullValues = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => removeNullValues(item));
    }
    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null) {
                result[key] = removeNullValues(value);
            }
        }
        return result;
    }
    return obj;
};
/**
 * Get MCP settings in JSON format for export/copy
 * Supports both full settings and individual server configuration
 */
export const getMcpSettingsJson = async (req, res) => {
    try {
        const { serverName } = req.query;
        if (serverName && typeof serverName === 'string') {
            // Return individual server configuration using DAO
            const serverDao = getServerDao();
            const serverConfig = await serverDao.findById(serverName);
            if (!serverConfig) {
                res.status(404).json({
                    success: false,
                    message: `Server '${serverName}' not found`,
                });
                return;
            }
            // Remove the 'name' field from config as it's used as the key
            const { name, ...configWithoutName } = serverConfig;
            // Remove null values from the config
            const cleanedConfig = removeNullValues(configWithoutName);
            res.json({
                success: true,
                data: {
                    mcpServers: {
                        [name]: cleanedConfig,
                    },
                },
            });
        }
        else {
            // Return full settings via DAO layer (supports both file and database modes)
            const [servers, users, groups, systemConfig, userConfigs, oauthClients, oauthTokens, bearerKeys,] = await Promise.all([
                getServerDao().findAll(),
                getUserDao().findAll(),
                getGroupDao().findAll(),
                getSystemConfigDao().get(),
                getUserConfigDao().getAll(),
                getOAuthClientDao().findAll(),
                getOAuthTokenDao().findAll(),
                getBearerKeyDao().findAll(),
            ]);
            const mcpServers = {};
            for (const { name: serverConfigName, ...config } of servers) {
                mcpServers[serverConfigName] = removeNullValues(config);
            }
            const settings = {
                mcpServers,
                users,
                groups,
                systemConfig,
                userConfigs,
                oauthClients,
                oauthTokens,
                bearerKeys,
            };
            res.json({
                success: true,
                data: settings,
            });
        }
    }
    catch (error) {
        console.error('Error getting MCP settings JSON:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get MCP settings',
        });
    }
};
//# sourceMappingURL=configController.js.map
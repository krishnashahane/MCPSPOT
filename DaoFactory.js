import { UserDaoImpl } from './UserDao.js';
import { ServerDaoImpl } from './ServerDao.js';
import { GroupDaoImpl } from './GroupDao.js';
import { SystemConfigDaoImpl } from './SystemConfigDao.js';
import { UserConfigDaoImpl } from './UserConfigDao.js';
import { OAuthClientDaoImpl } from './OAuthClientDao.js';
import { OAuthTokenDaoImpl } from './OAuthTokenDao.js';
import { BearerKeyDaoImpl } from './BearerKeyDao.js';
import { BuiltinPromptDaoImpl } from './BuiltinPromptDao.js';
import { BuiltinResourceDaoImpl } from './BuiltinResourceDao.js';
/**
 * Default DAO factory implementation using JSON file-based DAOs
 */
export class JsonFileDaoFactory {
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!JsonFileDaoFactory.instance) {
            JsonFileDaoFactory.instance = new JsonFileDaoFactory();
        }
        return JsonFileDaoFactory.instance;
    }
    constructor() {
        this.userDao = null;
        this.serverDao = null;
        this.groupDao = null;
        this.systemConfigDao = null;
        this.userConfigDao = null;
        this.oauthClientDao = null;
        this.oauthTokenDao = null;
        this.bearerKeyDao = null;
        this.builtinPromptDao = null;
        this.builtinResourceDao = null;
        // Private constructor for singleton
    }
    getUserDao() {
        if (!this.userDao) {
            this.userDao = new UserDaoImpl();
        }
        return this.userDao;
    }
    getServerDao() {
        if (!this.serverDao) {
            this.serverDao = new ServerDaoImpl();
        }
        return this.serverDao;
    }
    getGroupDao() {
        if (!this.groupDao) {
            this.groupDao = new GroupDaoImpl();
        }
        return this.groupDao;
    }
    getSystemConfigDao() {
        if (!this.systemConfigDao) {
            this.systemConfigDao = new SystemConfigDaoImpl();
        }
        return this.systemConfigDao;
    }
    getUserConfigDao() {
        if (!this.userConfigDao) {
            this.userConfigDao = new UserConfigDaoImpl();
        }
        return this.userConfigDao;
    }
    getOAuthClientDao() {
        if (!this.oauthClientDao) {
            this.oauthClientDao = new OAuthClientDaoImpl();
        }
        return this.oauthClientDao;
    }
    getOAuthTokenDao() {
        if (!this.oauthTokenDao) {
            this.oauthTokenDao = new OAuthTokenDaoImpl();
        }
        return this.oauthTokenDao;
    }
    getBearerKeyDao() {
        if (!this.bearerKeyDao) {
            this.bearerKeyDao = new BearerKeyDaoImpl();
        }
        return this.bearerKeyDao;
    }
    getBuiltinPromptDao() {
        if (!this.builtinPromptDao) {
            this.builtinPromptDao = new BuiltinPromptDaoImpl();
        }
        return this.builtinPromptDao;
    }
    getBuiltinResourceDao() {
        if (!this.builtinResourceDao) {
            this.builtinResourceDao = new BuiltinResourceDaoImpl();
        }
        return this.builtinResourceDao;
    }
    /**
     * Reset all cached DAO instances (useful for testing)
     */
    resetInstances() {
        this.userDao = null;
        this.serverDao = null;
        this.groupDao = null;
        this.systemConfigDao = null;
        this.userConfigDao = null;
        this.oauthClientDao = null;
        this.oauthTokenDao = null;
        this.bearerKeyDao = null;
        this.builtinPromptDao = null;
        this.builtinResourceDao = null;
    }
}
/**
 * Global DAO factory instance
 */
let daoFactory = JsonFileDaoFactory.getInstance();
/**
 * Set the global DAO factory (useful for dependency injection)
 */
export function setDaoFactory(factory) {
    daoFactory = factory;
}
/**
 * Get the global DAO factory
 */
export function getDaoFactory() {
    return daoFactory;
}
/**
 * Switch to database-backed DAOs based on environment variable
 * This is synchronous and should be called during app initialization
 */
export async function initializeDaoFactory() {
    // If USE_DB is explicitly set, use its value; otherwise, auto-detect based on DB_URL presence
    const useDatabase = process.env.USE_DB !== undefined ? process.env.USE_DB === 'true' : !!process.env.DB_URL;
    if (useDatabase) {
        console.log('Using database-backed DAO implementations');
        // Dynamic import to avoid circular dependencies
        const { DatabaseDaoFactory } = await import('./DatabaseDaoFactory.js');
        setDaoFactory(DatabaseDaoFactory.getInstance());
    }
    else {
        console.log('Using file-based DAO implementations');
        setDaoFactory(JsonFileDaoFactory.getInstance());
    }
}
/**
 * Convenience functions to get specific DAOs
 */
export function getUserDao() {
    return getDaoFactory().getUserDao();
}
export function getServerDao() {
    return getDaoFactory().getServerDao();
}
export function getGroupDao() {
    return getDaoFactory().getGroupDao();
}
export function getSystemConfigDao() {
    return getDaoFactory().getSystemConfigDao();
}
export function getUserConfigDao() {
    return getDaoFactory().getUserConfigDao();
}
export function getOAuthClientDao() {
    return getDaoFactory().getOAuthClientDao();
}
export function getOAuthTokenDao() {
    return getDaoFactory().getOAuthTokenDao();
}
export function getBearerKeyDao() {
    return getDaoFactory().getBearerKeyDao();
}
export function getBuiltinPromptDao() {
    return getDaoFactory().getBuiltinPromptDao();
}
export function getBuiltinResourceDao() {
    return getDaoFactory().getBuiltinResourceDao();
}
export function getActivityDao() {
    return getDaoFactory().getActivityDao?.();
}
/**
 * Check if activity logging is available (database mode only)
 */
export function isActivityLoggingEnabled() {
    return typeof getDaoFactory().getActivityDao === 'function';
}
//# sourceMappingURL=DaoFactory.js.map
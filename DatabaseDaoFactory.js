import { UserDaoDbImpl } from './UserDaoDbImpl.js';
import { ServerDaoDbImpl } from './ServerDaoDbImpl.js';
import { GroupDaoDbImpl } from './GroupDaoDbImpl.js';
import { SystemConfigDaoDbImpl } from './SystemConfigDaoDbImpl.js';
import { UserConfigDaoDbImpl } from './UserConfigDaoDbImpl.js';
import { OAuthClientDaoDbImpl } from './OAuthClientDaoDbImpl.js';
import { OAuthTokenDaoDbImpl } from './OAuthTokenDaoDbImpl.js';
import { BearerKeyDaoDbImpl } from './BearerKeyDaoDbImpl.js';
import { BuiltinPromptDaoDbImpl } from './BuiltinPromptDaoDbImpl.js';
import { BuiltinResourceDaoDbImpl } from './BuiltinResourceDaoDbImpl.js';
import { ActivityDaoDbImpl } from './ActivityDao.js';
/**
 * Database-backed DAO factory implementation
 */
export class DatabaseDaoFactory {
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!DatabaseDaoFactory.instance) {
            DatabaseDaoFactory.instance = new DatabaseDaoFactory();
        }
        return DatabaseDaoFactory.instance;
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
        this.activityDao = null;
        // Private constructor for singleton
    }
    getUserDao() {
        if (!this.userDao) {
            this.userDao = new UserDaoDbImpl();
        }
        return this.userDao;
    }
    getServerDao() {
        if (!this.serverDao) {
            this.serverDao = new ServerDaoDbImpl();
        }
        return this.serverDao;
    }
    getGroupDao() {
        if (!this.groupDao) {
            this.groupDao = new GroupDaoDbImpl();
        }
        return this.groupDao;
    }
    getSystemConfigDao() {
        if (!this.systemConfigDao) {
            this.systemConfigDao = new SystemConfigDaoDbImpl();
        }
        return this.systemConfigDao;
    }
    getUserConfigDao() {
        if (!this.userConfigDao) {
            this.userConfigDao = new UserConfigDaoDbImpl();
        }
        return this.userConfigDao;
    }
    getOAuthClientDao() {
        if (!this.oauthClientDao) {
            this.oauthClientDao = new OAuthClientDaoDbImpl();
        }
        return this.oauthClientDao;
    }
    getOAuthTokenDao() {
        if (!this.oauthTokenDao) {
            this.oauthTokenDao = new OAuthTokenDaoDbImpl();
        }
        return this.oauthTokenDao;
    }
    getBearerKeyDao() {
        if (!this.bearerKeyDao) {
            this.bearerKeyDao = new BearerKeyDaoDbImpl();
        }
        return this.bearerKeyDao;
    }
    getBuiltinPromptDao() {
        if (!this.builtinPromptDao) {
            this.builtinPromptDao = new BuiltinPromptDaoDbImpl();
        }
        return this.builtinPromptDao;
    }
    getBuiltinResourceDao() {
        if (!this.builtinResourceDao) {
            this.builtinResourceDao = new BuiltinResourceDaoDbImpl();
        }
        return this.builtinResourceDao;
    }
    getActivityDao() {
        if (!this.activityDao) {
            this.activityDao = new ActivityDaoDbImpl();
        }
        return this.activityDao;
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
        this.activityDao = null;
    }
}
//# sourceMappingURL=DatabaseDaoFactory.js.map
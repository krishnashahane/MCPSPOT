import { getServerDao } from '../dao/index.js';
/**
 * Load the latest server configuration from DAO.
 */
export const loadServerConfig = async (serverName) => {
    const serverDao = getServerDao();
    const server = await serverDao.findById(serverName);
    if (!server) {
        return undefined;
    }
    const { name: _, ...config } = server;
    return config;
};
/**
 * Mutate OAuth configuration for a server and persist the updated settings.
 * The mutator receives the server config to allow related updates when needed.
 */
export const mutateOAuthSettings = async (serverName, mutator) => {
    const serverDao = getServerDao();
    const server = await serverDao.findById(serverName);
    if (!server) {
        console.warn(`Server ${serverName} not found while updating OAuth settings`);
        return undefined;
    }
    const { name: _, ...serverConfig } = server;
    if (!serverConfig.oauth) {
        serverConfig.oauth = {};
    }
    const context = {
        serverConfig,
        oauth: serverConfig.oauth,
    };
    mutator(context);
    const updated = await serverDao.update(serverName, { oauth: serverConfig.oauth });
    if (!updated) {
        throw new Error(`Failed to persist OAuth settings for server ${serverName}`);
    }
    return context.serverConfig;
};
export const persistClientCredentials = async (serverName, credentials) => {
    const updated = await mutateOAuthSettings(serverName, ({ oauth }) => {
        oauth.clientId = credentials.clientId;
        oauth.clientSecret = credentials.clientSecret;
        if (credentials.scopes && credentials.scopes.length > 0) {
            oauth.scopes = credentials.scopes;
        }
        if (credentials.authorizationEndpoint) {
            oauth.authorizationEndpoint = credentials.authorizationEndpoint;
        }
        if (credentials.tokenEndpoint) {
            oauth.tokenEndpoint = credentials.tokenEndpoint;
        }
    });
    console.log(`Persisted OAuth client credentials for server: ${serverName}`);
    if (credentials.scopes && credentials.scopes.length > 0) {
        console.log(`Stored OAuth scopes for ${serverName}: ${credentials.scopes.join(', ')}`);
    }
    return updated;
};
/**
 * Persist OAuth tokens and optionally replace the stored refresh token.
 */
export const persistTokens = async (serverName, tokens) => {
    return mutateOAuthSettings(serverName, ({ oauth }) => {
        oauth.accessToken = tokens.accessToken;
        if (tokens.refreshToken !== undefined) {
            if (tokens.refreshToken) {
                oauth.refreshToken = tokens.refreshToken;
            }
            else {
                delete oauth.refreshToken;
            }
        }
        if (tokens.clearPendingAuthorization && oauth.pendingAuthorization) {
            delete oauth.pendingAuthorization;
        }
    });
};
/**
 * Update or create a pending authorization record.
 */
export const updatePendingAuthorization = async (serverName, pending) => {
    return mutateOAuthSettings(serverName, ({ oauth }) => {
        oauth.pendingAuthorization = {
            ...(oauth.pendingAuthorization || {}),
            ...pending,
            createdAt: pending.createdAt ?? Date.now(),
        };
    });
};
/**
 * Clear cached OAuth data using shared helpers.
 */
export const clearOAuthData = async (serverName, scope) => {
    return mutateOAuthSettings(serverName, ({ oauth }) => {
        if (scope === 'tokens' || scope === 'all') {
            delete oauth.accessToken;
            delete oauth.refreshToken;
        }
        if (scope === 'client' || scope === 'all') {
            delete oauth.clientId;
            delete oauth.clientSecret;
        }
        if (scope === 'verifier' || scope === 'all') {
            if (oauth.pendingAuthorization) {
                delete oauth.pendingAuthorization;
            }
        }
    });
};
//# sourceMappingURL=oauthSettingsStore.js.map
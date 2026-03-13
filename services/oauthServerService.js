import OAuth2Server from '@node-oauth/oauth2-server';
import { getSystemConfigDao } from '../dao/index.js';
import { findUserByUsername, verifyPassword } from '../models/User.js';
import { findOAuthClientById, saveAuthorizationCode, getAuthorizationCode, revokeAuthorizationCode, saveToken, getToken, revokeToken, } from '../models/OAuth.js';
import crypto from 'crypto';
const { Request, Response } = OAuth2Server;
// OAuth2Server model implementation
const oauthModel = {
    /**
     * Get client by client ID
     */
    getClient: async (clientId, clientSecret) => {
        const client = await findOAuthClientById(clientId);
        if (!client) {
            return false;
        }
        // If client secret is provided, verify it
        if (clientSecret && client.clientSecret) {
            if (client.clientSecret !== clientSecret) {
                return false;
            }
        }
        return {
            id: client.clientId,
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            redirectUris: client.redirectUris,
            grants: client.grants,
        };
    },
    /**
     * Save authorization code
     */
    saveAuthorizationCode: async (code, client, user) => {
        const systemConfigDao = getSystemConfigDao();
        const systemConfig = await systemConfigDao.get();
        const oauthConfig = systemConfig?.oauthServer;
        const lifetime = oauthConfig?.authorizationCodeLifetime || 300;
        const scopeString = Array.isArray(code.scope) ? code.scope.join(' ') : code.scope;
        const authCode = saveAuthorizationCode({
            redirectUri: code.redirectUri,
            scope: scopeString,
            clientId: client.id,
            username: user.username,
            codeChallenge: code.codeChallenge,
            codeChallengeMethod: code.codeChallengeMethod,
        }, lifetime);
        return {
            authorizationCode: authCode,
            expiresAt: new Date(Date.now() + lifetime * 1000),
            redirectUri: code.redirectUri,
            scope: code.scope,
            client,
            user: {
                username: user.username,
            },
            codeChallenge: code.codeChallenge,
            codeChallengeMethod: code.codeChallengeMethod,
        };
    },
    /**
     * Get authorization code
     */
    getAuthorizationCode: async (authorizationCode) => {
        const code = getAuthorizationCode(authorizationCode);
        if (!code) {
            return false;
        }
        const client = await findOAuthClientById(code.clientId);
        if (!client) {
            return false;
        }
        const scopeArray = code.scope ? code.scope.split(' ') : undefined;
        return {
            authorizationCode: code.code,
            expiresAt: code.expiresAt,
            redirectUri: code.redirectUri,
            scope: scopeArray,
            client: {
                id: client.clientId,
                clientId: client.clientId,
                clientSecret: client.clientSecret,
                redirectUris: client.redirectUris,
                grants: client.grants,
            },
            user: {
                username: code.username,
            },
            codeChallenge: code.codeChallenge,
            codeChallengeMethod: code.codeChallengeMethod,
        };
    },
    /**
     * Revoke authorization code
     */
    revokeAuthorizationCode: async (code) => {
        revokeAuthorizationCode(code.authorizationCode);
        return true;
    },
    /**
     * Save access token and refresh token
     */
    saveToken: async (token, client, user) => {
        const systemConfigDao = getSystemConfigDao();
        const systemConfig = await systemConfigDao.get();
        const oauthConfig = systemConfig?.oauthServer;
        const accessTokenLifetime = oauthConfig?.accessTokenLifetime || 3600;
        const refreshTokenLifetime = oauthConfig?.refreshTokenLifetime || 1209600;
        const scopeString = Array.isArray(token.scope) ? token.scope.join(' ') : token.scope;
        const savedToken = await saveToken({
            scope: scopeString,
            clientId: client.id,
            username: user.username,
        }, accessTokenLifetime, refreshTokenLifetime);
        const scopeArray = savedToken.scope ? savedToken.scope.split(' ') : undefined;
        return {
            accessToken: savedToken.accessToken,
            accessTokenExpiresAt: savedToken.accessTokenExpiresAt,
            refreshToken: savedToken.refreshToken,
            refreshTokenExpiresAt: savedToken.refreshTokenExpiresAt,
            scope: scopeArray,
            client,
            user: {
                username: user.username,
            },
        };
    },
    /**
     * Get access token
     */
    getAccessToken: async (accessToken) => {
        const token = await getToken(accessToken);
        if (!token) {
            return false;
        }
        const client = await findOAuthClientById(token.clientId);
        if (!client) {
            return false;
        }
        const scopeArray = token.scope ? token.scope.split(' ') : undefined;
        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            scope: scopeArray,
            client: {
                id: client.clientId,
                clientId: client.clientId,
                clientSecret: client.clientSecret,
                redirectUris: client.redirectUris,
                grants: client.grants,
            },
            user: {
                username: token.username,
            },
        };
    },
    /**
     * Get refresh token
     */
    getRefreshToken: async (refreshToken) => {
        const token = await getToken(refreshToken);
        if (!token || token.refreshToken !== refreshToken) {
            return false;
        }
        const client = await findOAuthClientById(token.clientId);
        if (!client) {
            return false;
        }
        const scopeArray = token.scope ? token.scope.split(' ') : undefined;
        return {
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: scopeArray,
            client: {
                id: client.clientId,
                clientId: client.clientId,
                clientSecret: client.clientSecret,
                redirectUris: client.redirectUris,
                grants: client.grants,
            },
            user: {
                username: token.username,
            },
        };
    },
    /**
     * Revoke token
     */
    revokeToken: async (token) => {
        const refreshToken = 'refreshToken' in token ? token.refreshToken : undefined;
        if (refreshToken) {
            await revokeToken(refreshToken);
        }
        return true;
    },
    /**
     * Verify scope
     */
    verifyScope: async (token, scope) => {
        if (!token.scope) {
            return false;
        }
        const requestedScopes = Array.isArray(scope) ? scope : scope.split(' ');
        const tokenScopes = Array.isArray(token.scope)
            ? token.scope
            : token.scope.split(' ');
        return requestedScopes.every((s) => tokenScopes.includes(s));
    },
    /**
     * Validate scope
     */
    validateScope: async (user, client, scope) => {
        const systemConfigDao = getSystemConfigDao();
        const systemConfig = await systemConfigDao.get();
        const oauthConfig = systemConfig?.oauthServer;
        const allowedScopes = oauthConfig?.allowedScopes || ['read', 'write'];
        if (!scope || scope.length === 0) {
            return allowedScopes;
        }
        const validScopes = scope.filter((s) => allowedScopes.includes(s));
        return validScopes.length > 0 ? validScopes : false;
    },
};
// Create OAuth2 server instance
let oauth = null;
/**
 * Initialize OAuth server
 */
export const initOAuthServer = async () => {
    const systemConfigDao = getSystemConfigDao();
    const systemConfig = await systemConfigDao.get();
    const oauthConfig = systemConfig?.oauthServer;
    const requireState = oauthConfig?.requireState === true;
    if (!oauthConfig || !oauthConfig.enabled) {
        console.log('OAuth authorization server is disabled or not configured');
        return;
    }
    try {
        oauth = new OAuth2Server({
            model: oauthModel,
            accessTokenLifetime: oauthConfig.accessTokenLifetime || 3600,
            refreshTokenLifetime: oauthConfig.refreshTokenLifetime || 1209600,
            authorizationCodeLifetime: oauthConfig.authorizationCodeLifetime || 300,
            allowEmptyState: !requireState,
            allowBearerTokensInQueryString: false,
            // When requireClientSecret is false, allow PKCE without client secret
            requireClientAuthentication: oauthConfig.requireClientSecret
                ? { authorization_code: true, refresh_token: true }
                : { authorization_code: false, refresh_token: false },
        });
        console.log('OAuth authorization server initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize OAuth authorization server:', error);
        oauth = null;
    }
};
/**
 * Get OAuth server instance
 */
export const getOAuthServer = () => {
    return oauth;
};
/**
 * Check if OAuth server is enabled
 */
export const isOAuthServerEnabled = () => {
    return oauth !== null;
};
/**
 * Authenticate user for OAuth authorization
 */
export const authenticateUser = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) {
        return null;
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        return null;
    }
    return {
        username: user.username,
        isAdmin: user.isAdmin,
    };
};
/**
 * Generate PKCE code verifier
 */
export const generateCodeVerifier = () => {
    return crypto.randomBytes(32).toString('base64url');
};
/**
 * Generate PKCE code challenge from verifier
 */
export const generateCodeChallenge = (verifier) => {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
};
/**
 * Verify PKCE code challenge
 */
export const verifyCodeChallenge = (verifier, challenge, method = 'S256') => {
    if (method === 'plain') {
        return verifier === challenge;
    }
    if (method === 'S256') {
        const computed = generateCodeChallenge(verifier);
        return computed === challenge;
    }
    return false;
};
/**
 * Handle OAuth authorize request
 */
export const handleAuthorizeRequest = async (req, res) => {
    if (!oauth) {
        throw new Error('OAuth server not initialized');
    }
    const request = new Request(req);
    const response = new Response(res);
    return await oauth.authorize(request, response);
};
/**
 * Handle OAuth token request
 */
export const handleTokenRequest = async (req, res) => {
    if (!oauth) {
        throw new Error('OAuth server not initialized');
    }
    const request = new Request(req);
    const response = new Response(res);
    return await oauth.token(request, response);
};
/**
 * Handle OAuth authenticate request (validate access token)
 */
export const handleAuthenticateRequest = async (req, res) => {
    if (!oauth) {
        throw new Error('OAuth server not initialized');
    }
    const request = new Request(req);
    const response = new Response(res);
    return await oauth.authenticate(request, response);
};
//# sourceMappingURL=oauthServerService.js.map
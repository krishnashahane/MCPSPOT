import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based OAuth Token DAO implementation
 */
export class OAuthTokenDaoImpl extends JsonFileBaseDao {
    async getAll() {
        const settings = await this.loadSettings();
        // Convert stored dates back to Date objects
        return (settings.oauthTokens || []).map((token) => ({
            ...token,
            accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
            refreshTokenExpiresAt: token.refreshTokenExpiresAt
                ? new Date(token.refreshTokenExpiresAt)
                : undefined,
        }));
    }
    async saveAll(tokens) {
        const settings = await this.loadSettings();
        settings.oauthTokens = tokens;
        await this.saveSettings(settings);
    }
    getEntityId(token) {
        return token.accessToken;
    }
    createEntity(_data) {
        throw new Error('accessToken must be provided');
    }
    updateEntity(existing, updates) {
        return {
            ...existing,
            ...updates,
            accessToken: existing.accessToken, // accessToken should not be updated
        };
    }
    async findAll() {
        return this.getAll();
    }
    async findById(accessToken) {
        return this.findByAccessToken(accessToken);
    }
    async findByAccessToken(accessToken) {
        const tokens = await this.getAll();
        return tokens.find((token) => token.accessToken === accessToken) || null;
    }
    async findByRefreshToken(refreshToken) {
        const tokens = await this.getAll();
        return tokens.find((token) => token.refreshToken === refreshToken) || null;
    }
    async findByClientId(clientId) {
        const tokens = await this.getAll();
        return tokens.filter((token) => token.clientId === clientId);
    }
    async findByUsername(username) {
        const tokens = await this.getAll();
        return tokens.filter((token) => token.username === username);
    }
    async create(data) {
        const tokens = await this.getAll();
        // Remove any existing tokens with the same access token or refresh token
        const filteredTokens = tokens.filter((t) => t.accessToken !== data.accessToken && t.refreshToken !== data.refreshToken);
        const newToken = {
            ...data,
        };
        filteredTokens.push(newToken);
        await this.saveAll(filteredTokens);
        return newToken;
    }
    async update(accessToken, updates) {
        const tokens = await this.getAll();
        const index = tokens.findIndex((token) => token.accessToken === accessToken);
        if (index === -1) {
            return null;
        }
        // Don't allow accessToken changes
        const { accessToken: _, ...allowedUpdates } = updates;
        const updatedToken = this.updateEntity(tokens[index], allowedUpdates);
        tokens[index] = updatedToken;
        await this.saveAll(tokens);
        return updatedToken;
    }
    async delete(accessToken) {
        const tokens = await this.getAll();
        const index = tokens.findIndex((token) => token.accessToken === accessToken);
        if (index === -1) {
            return false;
        }
        tokens.splice(index, 1);
        await this.saveAll(tokens);
        return true;
    }
    async exists(accessToken) {
        const token = await this.findByAccessToken(accessToken);
        return token !== null;
    }
    async count() {
        const tokens = await this.getAll();
        return tokens.length;
    }
    async revokeToken(token) {
        const tokens = await this.getAll();
        const tokenData = tokens.find((t) => t.accessToken === token || t.refreshToken === token);
        if (!tokenData) {
            return false;
        }
        const filteredTokens = tokens.filter((t) => t.accessToken !== tokenData.accessToken && t.refreshToken !== tokenData.refreshToken);
        await this.saveAll(filteredTokens);
        return true;
    }
    async revokeUserTokens(username) {
        const tokens = await this.getAll();
        const userTokens = tokens.filter((token) => token.username === username);
        const remainingTokens = tokens.filter((token) => token.username !== username);
        await this.saveAll(remainingTokens);
        return userTokens.length;
    }
    async revokeClientTokens(clientId) {
        const tokens = await this.getAll();
        const clientTokens = tokens.filter((token) => token.clientId === clientId);
        const remainingTokens = tokens.filter((token) => token.clientId !== clientId);
        await this.saveAll(remainingTokens);
        return clientTokens.length;
    }
    async cleanupExpired() {
        const tokens = await this.getAll();
        const now = new Date();
        const validTokens = tokens.filter((token) => {
            // Keep if access token is still valid
            if (token.accessTokenExpiresAt > now) {
                return true;
            }
            // Or if refresh token exists and is still valid
            if (token.refreshToken && token.refreshTokenExpiresAt && token.refreshTokenExpiresAt > now) {
                return true;
            }
            return false;
        });
        const expiredCount = tokens.length - validTokens.length;
        if (expiredCount > 0) {
            await this.saveAll(validTokens);
        }
        return expiredCount;
    }
    async isAccessTokenValid(accessToken) {
        const token = await this.findByAccessToken(accessToken);
        if (!token) {
            return false;
        }
        return token.accessTokenExpiresAt > new Date();
    }
    async isRefreshTokenValid(refreshToken) {
        const token = await this.findByRefreshToken(refreshToken);
        if (!token) {
            return false;
        }
        if (!token.refreshTokenExpiresAt) {
            return true; // No expiration means always valid
        }
        return token.refreshTokenExpiresAt > new Date();
    }
}
//# sourceMappingURL=OAuthTokenDao.js.map
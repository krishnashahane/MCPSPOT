import { OAuthTokenRepository } from '../db/repositories/OAuthTokenRepository.js';
/**
 * Database-backed implementation of OAuthTokenDao
 */
export class OAuthTokenDaoDbImpl {
    constructor() {
        this.repository = new OAuthTokenRepository();
    }
    async findAll() {
        const tokens = await this.repository.findAll();
        return tokens.map((t) => this.mapToOAuthToken(t));
    }
    async findById(accessToken) {
        const token = await this.repository.findByAccessToken(accessToken);
        return token ? this.mapToOAuthToken(token) : null;
    }
    async findByAccessToken(accessToken) {
        return this.findById(accessToken);
    }
    async findByRefreshToken(refreshToken) {
        const token = await this.repository.findByRefreshToken(refreshToken);
        return token ? this.mapToOAuthToken(token) : null;
    }
    async findByClientId(clientId) {
        const tokens = await this.repository.findByClientId(clientId);
        return tokens.map((t) => this.mapToOAuthToken(t));
    }
    async findByUsername(username) {
        const tokens = await this.repository.findByUsername(username);
        return tokens.map((t) => this.mapToOAuthToken(t));
    }
    async create(entity) {
        const token = await this.repository.create({
            accessToken: entity.accessToken,
            accessTokenExpiresAt: entity.accessTokenExpiresAt,
            refreshToken: entity.refreshToken,
            refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
            scope: entity.scope,
            clientId: entity.clientId,
            username: entity.username,
        });
        return this.mapToOAuthToken(token);
    }
    async update(accessToken, entity) {
        const token = await this.repository.update(accessToken, {
            accessTokenExpiresAt: entity.accessTokenExpiresAt,
            refreshToken: entity.refreshToken,
            refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
            scope: entity.scope,
        });
        return token ? this.mapToOAuthToken(token) : null;
    }
    async delete(accessToken) {
        return await this.repository.delete(accessToken);
    }
    async exists(accessToken) {
        return await this.repository.exists(accessToken);
    }
    async count() {
        return await this.repository.count();
    }
    async revokeToken(token) {
        return await this.repository.revokeToken(token);
    }
    async revokeUserTokens(username) {
        return await this.repository.revokeUserTokens(username);
    }
    async revokeClientTokens(clientId) {
        return await this.repository.revokeClientTokens(clientId);
    }
    async cleanupExpired() {
        return await this.repository.cleanupExpired();
    }
    async isAccessTokenValid(accessToken) {
        return await this.repository.isAccessTokenValid(accessToken);
    }
    async isRefreshTokenValid(refreshToken) {
        return await this.repository.isRefreshTokenValid(refreshToken);
    }
    mapToOAuthToken(token) {
        return {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            clientId: token.clientId,
            username: token.username,
        };
    }
}
//# sourceMappingURL=OAuthTokenDaoDbImpl.js.map
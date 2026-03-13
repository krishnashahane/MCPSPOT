import { SystemConfigRepository } from '../db/repositories/SystemConfigRepository.js';
/**
 * Database-backed implementation of SystemConfigDao
 */
export class SystemConfigDaoDbImpl {
    constructor() {
        this.repository = new SystemConfigRepository();
    }
    async get() {
        const config = await this.repository.get();
        return {
            routing: config.routing,
            install: config.install,
            smartRouting: config.smartRouting,
            mcpRouter: config.mcpRouter,
            nameSeparator: config.nameSeparator,
            oauth: config.oauth,
            oauthServer: config.oauthServer,
            auth: config.auth,
            enableSessionRebuild: config.enableSessionRebuild,
        };
    }
    async update(config) {
        const updated = await this.repository.update(config);
        return {
            routing: updated.routing,
            install: updated.install,
            smartRouting: updated.smartRouting,
            mcpRouter: updated.mcpRouter,
            nameSeparator: updated.nameSeparator,
            oauth: updated.oauth,
            oauthServer: updated.oauthServer,
            auth: updated.auth,
            enableSessionRebuild: updated.enableSessionRebuild,
        };
    }
    async reset() {
        const config = await this.repository.reset();
        return {
            routing: config.routing,
            install: config.install,
            smartRouting: config.smartRouting,
            mcpRouter: config.mcpRouter,
            nameSeparator: config.nameSeparator,
            oauth: config.oauth,
            oauthServer: config.oauthServer,
            auth: config.auth,
            enableSessionRebuild: config.enableSessionRebuild,
        };
    }
    async getSection(section) {
        return (await this.repository.getSection(section));
    }
    async updateSection(section, value) {
        await this.repository.updateSection(section, value);
        return true;
    }
}
//# sourceMappingURL=SystemConfigDaoDbImpl.js.map
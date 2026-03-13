import { randomUUID } from 'node:crypto';
import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based BuiltinResource DAO implementation
 * Stores resources under the top-level `resources` field in mcp_settings.json
 */
export class BuiltinResourceDaoImpl extends JsonFileBaseDao {
    async loadResources() {
        const settings = await this.loadSettings();
        return settings.resources || [];
    }
    async saveResources(resources) {
        const settings = await this.loadSettings();
        settings.resources = resources;
        await this.saveSettings(settings);
    }
    async findAll() {
        return this.loadResources();
    }
    async findEnabled() {
        const resources = await this.loadResources();
        return resources.filter((r) => r.enabled !== false);
    }
    async findById(id) {
        const resources = await this.loadResources();
        return resources.find((r) => r.id === id) || null;
    }
    async findByUri(uri) {
        const resources = await this.loadResources();
        return resources.find((r) => r.uri === uri) || null;
    }
    async create(data) {
        const resources = await this.loadResources();
        // Check for duplicate URI
        if (resources.find((r) => r.uri === data.uri)) {
            throw new Error(`Builtin resource with URI '${data.uri}' already exists`);
        }
        const newResource = {
            id: randomUUID(),
            enabled: true,
            ...data,
        };
        resources.push(newResource);
        await this.saveResources(resources);
        return newResource;
    }
    async update(id, data) {
        const resources = await this.loadResources();
        const index = resources.findIndex((r) => r.id === id);
        if (index === -1)
            return null;
        // If URI is being changed, check for duplicates
        if (data.uri && data.uri !== resources[index].uri) {
            if (resources.find((r) => r.uri === data.uri)) {
                throw new Error(`Builtin resource with URI '${data.uri}' already exists`);
            }
        }
        resources[index] = { ...resources[index], ...data };
        await this.saveResources(resources);
        return resources[index];
    }
    async delete(id) {
        const resources = await this.loadResources();
        const index = resources.findIndex((r) => r.id === id);
        if (index === -1)
            return false;
        resources.splice(index, 1);
        await this.saveResources(resources);
        return true;
    }
}
//# sourceMappingURL=BuiltinResourceDao.js.map
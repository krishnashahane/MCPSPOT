import { randomUUID } from 'node:crypto';
import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
/**
 * JSON file-based BuiltinPrompt DAO implementation
 * Stores prompts under the top-level `prompts` field in mcp_settings.json
 */
export class BuiltinPromptDaoImpl extends JsonFileBaseDao {
    async loadPrompts() {
        const settings = await this.loadSettings();
        return settings.prompts || [];
    }
    async savePrompts(prompts) {
        const settings = await this.loadSettings();
        settings.prompts = prompts;
        await this.saveSettings(settings);
    }
    async findAll() {
        return this.loadPrompts();
    }
    async findEnabled() {
        const prompts = await this.loadPrompts();
        return prompts.filter((p) => p.enabled !== false);
    }
    async findById(id) {
        const prompts = await this.loadPrompts();
        return prompts.find((p) => p.id === id) || null;
    }
    async findByName(name) {
        const prompts = await this.loadPrompts();
        return prompts.find((p) => p.name === name) || null;
    }
    async create(data) {
        const prompts = await this.loadPrompts();
        // Check for duplicate name
        if (prompts.find((p) => p.name === data.name)) {
            throw new Error(`Builtin prompt with name '${data.name}' already exists`);
        }
        const newPrompt = {
            id: randomUUID(),
            enabled: true,
            ...data,
        };
        prompts.push(newPrompt);
        await this.savePrompts(prompts);
        return newPrompt;
    }
    async update(id, data) {
        const prompts = await this.loadPrompts();
        const index = prompts.findIndex((p) => p.id === id);
        if (index === -1)
            return null;
        // If name is being changed, check for duplicates
        if (data.name && data.name !== prompts[index].name) {
            if (prompts.find((p) => p.name === data.name)) {
                throw new Error(`Builtin prompt with name '${data.name}' already exists`);
            }
        }
        prompts[index] = { ...prompts[index], ...data };
        await this.savePrompts(prompts);
        return prompts[index];
    }
    async delete(id) {
        const prompts = await this.loadPrompts();
        const index = prompts.findIndex((p) => p.id === id);
        if (index === -1)
            return false;
        prompts.splice(index, 1);
        await this.savePrompts(prompts);
        return true;
    }
}
//# sourceMappingURL=BuiltinPromptDao.js.map
import { BuiltinPrompt } from '../entities/BuiltinPrompt.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for BuiltinPrompt entity
 */
export class BuiltinPromptRepository {
    constructor() {
        this.repository = getAppDataSource().getRepository(BuiltinPrompt);
    }
    async findAll() {
        return await this.repository.find({ order: { createdAt: 'ASC' } });
    }
    async findEnabled() {
        return await this.repository.find({ where: { enabled: true }, order: { createdAt: 'ASC' } });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }
    async findByName(name) {
        return await this.repository.findOne({ where: { name } });
    }
    async create(data) {
        const entity = this.repository.create(data);
        return await this.repository.save(entity);
    }
    async update(id, updates) {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }
        const merged = this.repository.merge(existing, updates);
        return await this.repository.save(merged);
    }
    async delete(id) {
        const result = await this.repository.delete({ id });
        return (result.affected ?? 0) > 0;
    }
}
export default BuiltinPromptRepository;
//# sourceMappingURL=BuiltinPromptRepository.js.map
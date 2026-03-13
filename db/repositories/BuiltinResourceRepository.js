import { BuiltinResource } from '../entities/BuiltinResource.js';
import { getAppDataSource } from '../connection.js';
/**
 * Repository for BuiltinResource entity
 */
export class BuiltinResourceRepository {
    constructor() {
        this.repository = getAppDataSource().getRepository(BuiltinResource);
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
    async findByUri(uri) {
        return await this.repository.findOne({ where: { uri } });
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
export default BuiltinResourceRepository;
//# sourceMappingURL=BuiltinResourceRepository.js.map
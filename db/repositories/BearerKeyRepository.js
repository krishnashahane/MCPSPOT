import { BearerKey } from '../entities/BearerKey.js';
import { getAppDataSource } from '../connection.js';
import { withDbRetry } from '../../utils/dbRetry.js';
// Default retry options
const DEFAULT_RETRY_OPTIONS = {
    maxRetries: 3,
    initialDelayMs: 500,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    jitter: true,
};
/**
 * Repository for BearerKey entity with automatic retry logic
 */
export class BearerKeyRepository {
    constructor(retryOptions) {
        this.repository = getAppDataSource().getRepository(BearerKey);
        this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
    }
    /**
     * Execute an operation with retry logic
     */
    async withRetry(operation, operationName) {
        return withDbRetry(operation, {
            ...this.retryOptions,
            operationName: `BearerKeyRepository.${operationName}`,
        });
    }
    /**
     * Find all bearer keys
     */
    async findAll() {
        return this.withRetry(() => this.repository.find({ order: { createdAt: 'ASC' } }), 'findAll');
    }
    /**
     * Count bearer keys
     */
    async count() {
        return this.withRetry(() => this.repository.count(), 'count');
    }
    /**
     * Find bearer key by id
     */
    async findById(id) {
        return this.withRetry(() => this.repository.findOne({ where: { id } }), 'findById');
    }
    /**
     * Find bearer key by token value
     */
    async findByToken(token) {
        return this.withRetry(() => this.repository.findOne({ where: { token } }), 'findByToken');
    }
    /**
     * Create a new bearer key
     */
    async create(data) {
        return this.withRetry(async () => {
            const entity = this.repository.create(data);
            return await this.repository.save(entity);
        }, 'create');
    }
    /**
     * Update an existing bearer key
     */
    async update(id, updates) {
        return this.withRetry(async () => {
            const existing = await this.findById(id);
            if (!existing) {
                return null;
            }
            const merged = this.repository.merge(existing, updates);
            return await this.repository.save(merged);
        }, 'update');
    }
    /**
     * Delete a bearer key
     */
    async delete(id) {
        return this.withRetry(async () => {
            const result = await this.repository.delete({ id });
            return (result.affected ?? 0) > 0;
        }, 'delete');
    }
}
export default BearerKeyRepository;
//# sourceMappingURL=BearerKeyRepository.js.map
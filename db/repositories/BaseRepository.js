import { getAppDataSource } from '../connection.js';
import { withDbRetry } from '../../utils/dbRetry.js';
// Default retry options for repository operations
const DEFAULT_RETRY_OPTIONS = {
    maxRetries: 3,
    initialDelayMs: 500,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    jitter: true,
};
/**
 * Base repository class with common CRUD operations and automatic retry logic
 * for handling transient database connection failures.
 */
export class BaseRepository {
    constructor(entityClass, retryOptions) {
        this.repository = getAppDataSource().getRepository(entityClass);
        this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
    }
    /**
     * Execute an operation with retry logic
     * @param operation The operation to execute
     * @param operationName Name of the operation for logging
     */
    async withRetry(operation, operationName) {
        return withDbRetry(operation, {
            ...this.retryOptions,
            operationName: `${this.constructor.name}.${operationName}`,
        });
    }
    /**
     * Get repository access
     */
    getRepository() {
        return this.repository;
    }
    /**
     * Find all entities
     */
    async findAll() {
        return this.withRetry(() => this.repository.find(), 'findAll');
    }
    /**
     * Find entity by ID
     * @param id Entity ID
     */
    async findById(id) {
        return this.withRetry(() => this.repository.findOneBy({ id }), 'findById');
    }
    /**
     * Save or update an entity
     * @param entity Entity to save
     */
    async save(entity) {
        return this.withRetry(() => this.repository.save(entity), 'save');
    }
    /**
     * Save multiple entities
     * @param entities Array of entities to save
     */
    async saveMany(entities) {
        return this.withRetry(() => this.repository.save(entities), 'saveMany');
    }
    /**
     * Delete an entity by ID
     * @param id Entity ID
     */
    async delete(id) {
        return this.withRetry(async () => {
            const result = await this.repository.delete(id);
            return result.affected !== null && result.affected !== undefined && result.affected > 0;
        }, 'delete');
    }
    /**
     * Count total entities
     */
    async count() {
        return this.withRetry(() => this.repository.count(), 'count');
    }
}
export default BaseRepository;
//# sourceMappingURL=BaseRepository.js.map
import { User } from '../entities/User.js';
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
 * Repository for User entity with automatic retry logic
 */
export class UserRepository {
    constructor(retryOptions) {
        this.repository = getAppDataSource().getRepository(User);
        this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
    }
    /**
     * Execute an operation with retry logic
     */
    async withRetry(operation, operationName) {
        return withDbRetry(operation, {
            ...this.retryOptions,
            operationName: `UserRepository.${operationName}`,
        });
    }
    /**
     * Find all users
     */
    async findAll() {
        return this.withRetry(() => this.repository.find({ order: { createdAt: 'ASC' } }), 'findAll');
    }
    /**
     * Find user by username
     */
    async findByUsername(username) {
        return this.withRetry(() => this.repository.findOne({ where: { username } }), 'findByUsername');
    }
    /**
     * Create a new user
     */
    async create(user) {
        return this.withRetry(async () => {
            const newUser = this.repository.create(user);
            return await this.repository.save(newUser);
        }, 'create');
    }
    /**
     * Update an existing user
     */
    async update(username, userData) {
        return this.withRetry(async () => {
            const user = await this.repository.findOne({ where: { username } });
            if (!user) {
                return null;
            }
            const updated = this.repository.merge(user, userData);
            return await this.repository.save(updated);
        }, 'update');
    }
    /**
     * Delete a user
     */
    async delete(username) {
        return this.withRetry(async () => {
            const result = await this.repository.delete({ username });
            return (result.affected ?? 0) > 0;
        }, 'delete');
    }
    /**
     * Check if user exists
     */
    async exists(username) {
        return this.withRetry(async () => {
            const count = await this.repository.count({ where: { username } });
            return count > 0;
        }, 'exists');
    }
    /**
     * Count total users
     */
    async count() {
        return this.withRetry(() => this.repository.count(), 'count');
    }
    /**
     * Find all admin users
     */
    async findAdmins() {
        return this.withRetry(() => this.repository.find({ where: { isAdmin: true }, order: { createdAt: 'ASC' } }), 'findAdmins');
    }
}
export default UserRepository;
//# sourceMappingURL=UserRepository.js.map
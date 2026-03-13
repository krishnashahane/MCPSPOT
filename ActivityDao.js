import { ActivityRepository } from '../db/repositories/ActivityRepository.js';
/**
 * Database implementation of ActivityDao
 * Activity logging is only available in database mode
 */
export class ActivityDaoDbImpl {
    constructor() {
        this.repository = new ActivityRepository();
    }
    async create(activity) {
        const created = await this.repository.create({
            timestamp: activity.timestamp,
            server: activity.server,
            tool: activity.tool,
            duration: activity.duration,
            status: activity.status,
            input: activity.input,
            output: activity.output,
            group: activity.group,
            keyId: activity.keyId,
            keyName: activity.keyName,
            errorMessage: activity.errorMessage,
        });
        return this.mapToActivity(created);
    }
    async findById(id) {
        const activity = await this.repository.findById(id);
        return activity ? this.mapToActivity(activity) : null;
    }
    async findPaginated(page, limit, filter) {
        const { data, total } = await this.repository.findPaginated(page, limit, filter);
        const totalPages = Math.ceil(total / limit);
        return {
            data: data.map((a) => this.mapToActivity(a)),
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getStats(filter) {
        return await this.repository.getStats(filter);
    }
    async deleteOlderThan(date) {
        return await this.repository.deleteOlderThan(date);
    }
    async getDistinctServers() {
        return await this.repository.getDistinctServers();
    }
    async getDistinctTools() {
        return await this.repository.getDistinctTools();
    }
    async getDistinctGroups() {
        return await this.repository.getDistinctGroups();
    }
    async getDistinctKeyNames() {
        return await this.repository.getDistinctKeyNames();
    }
    mapToActivity(entity) {
        return {
            id: entity.id,
            timestamp: entity.timestamp,
            server: entity.server,
            tool: entity.tool,
            duration: entity.duration,
            status: entity.status,
            input: entity.input,
            output: entity.output,
            group: entity.group,
            keyId: entity.keyId,
            keyName: entity.keyName,
            errorMessage: entity.errorMessage,
        };
    }
}
//# sourceMappingURL=ActivityDao.js.map
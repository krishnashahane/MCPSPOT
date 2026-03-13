/**
 * Base DAO implementation with common functionality
 */
export class BaseDaoImpl {
    async findAll() {
        return this.getAll();
    }
    async findById(id) {
        const entities = await this.getAll();
        return entities.find((entity) => this.getEntityId(entity) === id) || null;
    }
    async create(data) {
        const entities = await this.getAll();
        const newEntity = this.createEntity(data);
        entities.push(newEntity);
        await this.saveAll(entities);
        return newEntity;
    }
    async update(id, updates) {
        const entities = await this.getAll();
        const index = entities.findIndex((entity) => this.getEntityId(entity) === id);
        if (index === -1) {
            return null;
        }
        const updatedEntity = this.updateEntity(entities[index], updates);
        entities[index] = updatedEntity;
        await this.saveAll(entities);
        return updatedEntity;
    }
    async delete(id) {
        const entities = await this.getAll();
        const index = entities.findIndex((entity) => this.getEntityId(entity) === id);
        if (index === -1) {
            return false;
        }
        entities.splice(index, 1);
        await this.saveAll(entities);
        return true;
    }
    async exists(id) {
        const entity = await this.findById(id);
        return entity !== null;
    }
    async count() {
        const entities = await this.getAll();
        return entities.length;
    }
}
//# sourceMappingURL=BaseDao.js.map
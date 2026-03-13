import { JsonFileBaseDao } from './base/JsonFileBaseDao.js';
import bcrypt from 'bcryptjs';
/**
 * JSON file-based User DAO implementation
 */
export class UserDaoImpl extends JsonFileBaseDao {
    async getAll() {
        const settings = await this.loadSettings();
        return settings.users || [];
    }
    async saveAll(users) {
        const settings = await this.loadSettings();
        settings.users = users;
        await this.saveSettings(settings);
    }
    getEntityId(user) {
        return user.username;
    }
    createEntity(_data) {
        // This method should not be called directly for users
        throw new Error('Use createWithHashedPassword instead');
    }
    updateEntity(existing, updates) {
        return {
            ...existing,
            ...updates,
            username: existing.username, // Username should not be updated
        };
    }
    async findAll() {
        return this.getAll();
    }
    async findById(username) {
        return this.findByUsername(username);
    }
    async findByUsername(username) {
        const users = await this.getAll();
        return users.find((user) => user.username === username) || null;
    }
    async create(_data) {
        throw new Error('Use createWithHashedPassword instead');
    }
    async createWithHashedPassword(username, password, isAdmin = false) {
        const users = await this.getAll();
        // Check if user already exists
        if (users.find((user) => user.username === username)) {
            throw new Error(`User ${username} already exists`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            password: hashedPassword,
            isAdmin,
        };
        users.push(newUser);
        await this.saveAll(users);
        return newUser;
    }
    async update(username, updates) {
        const users = await this.getAll();
        const index = users.findIndex((user) => user.username === username);
        if (index === -1) {
            return null;
        }
        // Don't allow username changes
        const { username: _, ...allowedUpdates } = updates;
        const updatedUser = this.updateEntity(users[index], allowedUpdates);
        users[index] = updatedUser;
        await this.saveAll(users);
        return updatedUser;
    }
    async updatePassword(username, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await this.update(username, { password: hashedPassword });
        return result !== null;
    }
    async delete(username) {
        const users = await this.getAll();
        const index = users.findIndex((user) => user.username === username);
        if (index === -1) {
            return false;
        }
        users.splice(index, 1);
        await this.saveAll(users);
        return true;
    }
    async exists(username) {
        const user = await this.findByUsername(username);
        return user !== null;
    }
    async count() {
        const users = await this.getAll();
        return users.length;
    }
    async validateCredentials(username, password) {
        const user = await this.findByUsername(username);
        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }
    async findAdmins() {
        const users = await this.getAll();
        return users.filter((user) => user.isAdmin === true);
    }
}
//# sourceMappingURL=UserDao.js.map
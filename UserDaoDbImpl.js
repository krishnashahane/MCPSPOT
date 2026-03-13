import bcrypt from 'bcrypt';
import { UserRepository } from '../db/repositories/UserRepository.js';
/**
 * Database-backed implementation of UserDao
 */
export class UserDaoDbImpl {
    constructor() {
        this.repository = new UserRepository();
    }
    async findAll() {
        const users = await this.repository.findAll();
        return users.map((u) => ({
            username: u.username,
            password: u.password,
            isAdmin: u.isAdmin,
        }));
    }
    async findById(username) {
        const user = await this.repository.findByUsername(username);
        if (!user)
            return null;
        return {
            username: user.username,
            password: user.password,
            isAdmin: user.isAdmin,
        };
    }
    async findByUsername(username) {
        return await this.findById(username);
    }
    async create(entity) {
        const user = await this.repository.create({
            username: entity.username,
            password: entity.password,
            isAdmin: entity.isAdmin || false,
        });
        return {
            username: user.username,
            password: user.password,
            isAdmin: user.isAdmin,
        };
    }
    async createWithHashedPassword(username, password, isAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.create({ username, password: hashedPassword, isAdmin });
    }
    async update(username, entity) {
        const user = await this.repository.update(username, {
            password: entity.password,
            isAdmin: entity.isAdmin,
        });
        if (!user)
            return null;
        return {
            username: user.username,
            password: user.password,
            isAdmin: user.isAdmin,
        };
    }
    async delete(username) {
        return await this.repository.delete(username);
    }
    async exists(username) {
        return await this.repository.exists(username);
    }
    async count() {
        return await this.repository.count();
    }
    async validateCredentials(username, password) {
        const user = await this.findByUsername(username);
        if (!user) {
            return false;
        }
        return await bcrypt.compare(password, user.password);
    }
    async updatePassword(username, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await this.update(username, { password: hashedPassword });
        return result !== null;
    }
    async findAdmins() {
        const users = await this.repository.findAdmins();
        return users.map((u) => ({
            username: u.username,
            password: u.password,
            isAdmin: u.isAdmin,
        }));
    }
}
//# sourceMappingURL=UserDaoDbImpl.js.map
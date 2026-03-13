import bcrypt from 'bcryptjs';
import { getUserDao } from '../dao/index.js';
const isDuplicateUserError = (error) => {
    if (!error || typeof error !== 'object') {
        return false;
    }
    const err = error;
    if (err.code === '23505' || err.driverError?.code === '23505') {
        return true;
    }
    const message = `${err.message || ''} ${err.driverError?.message || ''} ${err.driverError?.detail || ''}`
        .toLowerCase()
        .trim();
    return message.includes('already exists') || message.includes('duplicate');
};
// Get all users
export const getUsers = async () => {
    try {
        const userDao = getUserDao();
        return await userDao.findAll();
    }
    catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
};
// Create a new user
export const createUser = async (userData) => {
    try {
        const userDao = getUserDao();
        return await userDao.createWithHashedPassword(userData.username, userData.password, userData.isAdmin);
    }
    catch (error) {
        if (!isDuplicateUserError(error)) {
            console.error('Error creating user:', error);
        }
        return null;
    }
};
// Find user by username
export const findUserByUsername = async (username) => {
    try {
        const userDao = getUserDao();
        const user = await userDao.findByUsername(username);
        return user || undefined;
    }
    catch (error) {
        console.error('Error finding user:', error);
        return undefined;
    }
};
// Verify user password
export const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
// Update user password
export const updateUserPassword = async (username, newPassword) => {
    try {
        const userDao = getUserDao();
        return await userDao.updatePassword(username, newPassword);
    }
    catch (error) {
        console.error('Error updating password:', error);
        return false;
    }
};
// Initialize with default admin user if no users exist
export const initializeDefaultUser = async () => {
    const userDao = getUserDao();
    const users = await userDao.findAll();
    if (users.length === 0) {
        await userDao.createWithHashedPassword('admin', 'admin123', true);
        console.log('Default admin user created');
    }
};
//# sourceMappingURL=User.js.map
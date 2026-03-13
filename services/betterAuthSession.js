import crypto from 'crypto';
import { createUser, findUserByUsername } from '../models/User.js';
import { getBetterAuthRuntimeConfig } from './betterAuthConfig.js';
const buildUsernameFromSession = (session) => {
    const user = session?.user;
    if (!user) {
        return null;
    }
    return user.email || user.name || user.id || null;
};
export const getBetterAuthSession = async (req) => {
    if (!getBetterAuthRuntimeConfig().enabled) {
        return null;
    }
    try {
        const [{ auth }, { fromNodeHeaders }] = await Promise.all([
            import('../betterAuth.js'),
            import('better-auth/node'),
        ]);
        const headers = fromNodeHeaders(req.headers);
        const session = await auth.api.getSession({ headers });
        return session || null;
    }
    catch (error) {
        console.warn('Better Auth session lookup failed:', error);
        return null;
    }
};
export const resolveBetterAuthUser = async (req) => {
    const session = await getBetterAuthSession(req);
    if (!session) {
        return null;
    }
    const username = buildUsernameFromSession(session);
    if (!username) {
        return null;
    }
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        return existingUser;
    }
    const generatedPassword = crypto.randomUUID();
    const createdUser = await createUser({ username, password: generatedPassword, isAdmin: false });
    if (createdUser) {
        return createdUser;
    }
    const refreshedUser = await findUserByUsername(username);
    return refreshedUser || null;
};
//# sourceMappingURL=betterAuthSession.js.map
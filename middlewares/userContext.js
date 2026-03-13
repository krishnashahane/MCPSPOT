import { UserContextService } from '../services/userContextService.js';
import { resolveOAuthUserFromAuthHeader } from '../utils/oauthBearer.js';
/**
 * User context middleware
 * Sets user context after authentication middleware, allowing service layer to access current user information
 */
export const userContextMiddleware = async (req, res, next) => {
    try {
        const currentUser = req.user;
        if (currentUser) {
            // Set user context
            const userContextService = UserContextService.getInstance();
            userContextService.setCurrentUser(currentUser);
            // Clean up user context when response ends
            res.on('finish', () => {
                const userContextService = UserContextService.getInstance();
                userContextService.clearCurrentUser();
            });
        }
        next();
    }
    catch (error) {
        console.error('Error in user context middleware:', error);
        next(error);
    }
};
/**
 * User context middleware for SSE/MCP endpoints
 * Extracts user from URL path parameter and sets user context
 */
export const sseUserContextMiddleware = async (req, res, next) => {
    try {
        const userContextService = UserContextService.getInstance();
        const username = req.params.user;
        let cleanedUp = false;
        const cleanup = () => {
            if (cleanedUp) {
                return;
            }
            cleanedUp = true;
            userContextService.clearCurrentUser();
        };
        const attachCleanupHandlers = () => {
            res.on('finish', cleanup);
            res.on('close', cleanup);
        };
        if (username) {
            // For user-scoped routes, set the user context
            // Note: In a real implementation, you should validate the user exists
            // and has proper permissions
            const user = {
                username,
                password: '',
                isAdmin: false, // TODO: Should be retrieved from user database
            };
            userContextService.setCurrentUser(user);
            attachCleanupHandlers();
            console.log(`User context set for SSE/MCP endpoint: ${username}`);
        }
        else {
            const rawAuthHeader = Array.isArray(req.headers.authorization)
                ? req.headers.authorization[0]
                : req.headers.authorization;
            const bearerUser = await resolveOAuthUserFromAuthHeader(rawAuthHeader);
            if (bearerUser) {
                userContextService.setCurrentUser(bearerUser);
                attachCleanupHandlers();
                console.log(`OAuth user context set for SSE/MCP endpoint: ${bearerUser.username}`);
            }
            else {
                cleanup();
                console.log('Global SSE/MCP endpoint access - no user context');
            }
        }
        next();
    }
    catch (error) {
        console.error('Error in SSE user context middleware:', error);
        next(error);
    }
};
export class ContextAwareDataServiceImpl {
    getUserContextService() {
        return UserContextService.getInstance();
    }
    async getCurrentUserFromContext() {
        const userContextService = this.getUserContextService();
        return userContextService.getCurrentUser();
    }
    async getUserDataFromContext(dataType) {
        const userContextService = this.getUserContextService();
        const user = userContextService.getCurrentUser();
        if (!user) {
            throw new Error('No user in context');
        }
        console.log(`Getting ${dataType} data for user: ${user.username}`);
        // Return different data based on user permissions
        if (user.isAdmin) {
            return {
                type: dataType,
                data: 'Admin level data from context',
                user: user.username,
                access: 'full',
            };
        }
        else {
            return {
                type: dataType,
                data: 'User level data from context',
                user: user.username,
                access: 'limited',
            };
        }
    }
    async isCurrentUserAdmin() {
        const userContextService = this.getUserContextService();
        return userContextService.isAdmin();
    }
}
//# sourceMappingURL=userContext.js.map
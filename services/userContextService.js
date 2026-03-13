// User context storage
class UserContext {
    constructor() {
        this.currentUser = null;
    }
    static getInstance() {
        if (!UserContext.instance) {
            UserContext.instance = new UserContext();
        }
        return UserContext.instance;
    }
    setUser(user) {
        this.currentUser = user;
    }
    getUser() {
        return this.currentUser;
    }
    clearUser() {
        this.currentUser = null;
    }
}
export class UserContextService {
    constructor() {
        this.userContext = UserContext.getInstance();
    }
    static getInstance() {
        if (!UserContextService.instance) {
            UserContextService.instance = new UserContextService();
        }
        return UserContextService.instance;
    }
    getCurrentUser() {
        return this.userContext.getUser();
    }
    setCurrentUser(user) {
        this.userContext.setUser(user);
    }
    clearCurrentUser() {
        this.userContext.clearUser();
    }
    isAdmin() {
        const user = this.getCurrentUser();
        return user?.isAdmin || false;
    }
    hasUser() {
        return this.getCurrentUser() !== null;
    }
}
//# sourceMappingURL=userContextService.js.map
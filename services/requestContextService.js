import { AsyncLocalStorage } from 'node:async_hooks';
/**
 * Service for managing request context during MCP request processing
 * This allows MCP request handlers to access HTTP headers and other request metadata
 */
export class RequestContextService {
    constructor() {
        this.asyncLocalStorage = new AsyncLocalStorage();
    }
    static getInstance() {
        if (!RequestContextService.instance) {
            RequestContextService.instance = new RequestContextService();
        }
        return RequestContextService.instance;
    }
    createRequestContext(req) {
        return {
            headers: req.headers,
            sessionId: req.headers['mcp-session-id'] || undefined,
            userAgent: req.headers['user-agent'],
            remoteAddress: req.ip || req.socket?.remoteAddress,
        };
    }
    cloneRequestContext(context) {
        return {
            ...context,
            headers: { ...context.headers },
        };
    }
    runWithRequestContext(req, callback) {
        return this.asyncLocalStorage.run(this.createRequestContext(req), callback);
    }
    runWithCustomRequestContext(context, callback) {
        return this.asyncLocalStorage.run(this.cloneRequestContext(context), callback);
    }
    /**
     * Set the current request context from Express request
     */
    setRequestContext(req) {
        this.asyncLocalStorage.enterWith(this.createRequestContext(req));
    }
    /**
     * Set request context from custom data
     */
    setCustomRequestContext(context) {
        this.asyncLocalStorage.enterWith(this.cloneRequestContext(context));
    }
    /**
     * Get the current request context
     */
    getRequestContext() {
        return this.asyncLocalStorage.getStore() ?? null;
    }
    /**
     * Get headers from the current request context
     */
    getHeaders() {
        return this.getRequestContext()?.headers || null;
    }
    /**
     * Get a specific header value (case-insensitive)
     */
    getHeader(name) {
        const requestContext = this.getRequestContext();
        if (!requestContext?.headers) {
            return undefined;
        }
        // Try exact match first
        if (requestContext.headers[name]) {
            return requestContext.headers[name];
        }
        // Try lowercase match (Express normalizes headers to lowercase)
        const lowerName = name.toLowerCase();
        if (requestContext.headers[lowerName]) {
            return requestContext.headers[lowerName];
        }
        // Try case-insensitive search
        for (const [key, value] of Object.entries(requestContext.headers)) {
            if (key.toLowerCase() === lowerName) {
                return value;
            }
        }
        return undefined;
    }
    /**
     * Clear the current request context
     */
    clearRequestContext() {
        this.asyncLocalStorage.enterWith(null);
    }
    /**
     * Get session ID from current request context
     */
    getSessionId() {
        return this.getRequestContext()?.sessionId;
    }
    /**
     * Set bearer key context for activity logging
     */
    setBearerKeyContext(keyId, keyName) {
        const requestContext = this.getRequestContext();
        if (requestContext) {
            requestContext.keyId = keyId;
            requestContext.keyName = keyName;
        }
    }
    /**
     * Set group context for activity logging
     */
    setGroupContext(group) {
        const requestContext = this.getRequestContext();
        if (requestContext) {
            requestContext.group = group;
        }
    }
    /**
     * Get bearer key context
     */
    getBearerKeyContext() {
        const requestContext = this.getRequestContext();
        return {
            keyId: requestContext?.keyId,
            keyName: requestContext?.keyName,
        };
    }
    /**
     * Get group context
     */
    getGroupContext() {
        return this.getRequestContext()?.group;
    }
}
//# sourceMappingURL=requestContextService.js.map
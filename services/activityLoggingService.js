import { getActivityDao, isActivityLoggingEnabled } from '../dao/DaoFactory.js';
/**
 * Service for logging tool call activities
 * Only logs when in database mode
 */
export class ActivityLoggingService {
    static getInstance() {
        if (!ActivityLoggingService.instance) {
            ActivityLoggingService.instance = new ActivityLoggingService();
        }
        return ActivityLoggingService.instance;
    }
    constructor() {
        // Private constructor for singleton
    }
    /**
     * Check if activity logging is available
     */
    isEnabled() {
        return isActivityLoggingEnabled();
    }
    /**
     * Log a tool call activity
     */
    async logToolCall(params) {
        if (!this.isEnabled()) {
            return;
        }
        const activityDao = getActivityDao();
        if (!activityDao) {
            return;
        }
        try {
            const activity = {
                timestamp: new Date(),
                server: params.server,
                tool: params.tool,
                duration: params.duration,
                status: params.status,
                input: params.input ? this.safeStringify(params.input) : undefined,
                output: params.output ? this.safeStringify(params.output) : undefined,
                group: params.group,
                keyId: params.keyId,
                keyName: params.keyName,
                errorMessage: params.errorMessage,
            };
            await activityDao.create(activity);
        }
        catch (error) {
            // Don't let logging failures affect the main flow
            console.error('Failed to log activity:', error);
        }
    }
    /**
     * Safely stringify an object, handling circular references
     */
    safeStringify(obj) {
        try {
            // Limit the size of the stringified data
            const str = JSON.stringify(obj, this.getCircularReplacer(), 2);
            // Limit to 100KB
            if (str.length > 100000) {
                return JSON.stringify({
                    _truncated: true,
                    _message: 'Data too large to store',
                    _originalLength: str.length,
                });
            }
            return str;
        }
        catch (error) {
            return JSON.stringify({
                _error: 'Failed to stringify data',
                _type: typeof obj,
            });
        }
    }
    /**
     * Create a replacer function that handles circular references
     */
    getCircularReplacer() {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return '[Circular]';
                }
                seen.add(value);
            }
            return value;
        };
    }
}
/**
 * Convenience function to get the activity logging service instance
 */
export function getActivityLoggingService() {
    return ActivityLoggingService.getInstance();
}
//# sourceMappingURL=activityLoggingService.js.map
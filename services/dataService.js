import { UserContextService } from './userContextService.js';
export class DataService {
    filterData(data, user) {
        // Use passed user parameter if available, otherwise fall back to context
        const currentUser = user || UserContextService.getInstance().getCurrentUser();
        if (!currentUser || currentUser.isAdmin) {
            return data;
        }
        else {
            return data.filter((item) => item.owner === currentUser?.username);
        }
    }
    filterSettings(settings, user) {
        // Use passed user parameter if available, otherwise fall back to context
        const currentUser = user || UserContextService.getInstance().getCurrentUser();
        if (!currentUser || currentUser.isAdmin) {
            const result = { ...settings };
            delete result.userConfigs;
            return result;
        }
        else {
            const result = { ...settings };
            // TODO: apply userConfig to filter settings as needed
            // const userConfig = settings.userConfigs?.[currentUser?.username || ''];
            delete result.userConfigs;
            return result;
        }
    }
    mergeSettings(all, newSettings, user) {
        // Use passed user parameter if available, otherwise fall back to context
        const currentUser = user || UserContextService.getInstance().getCurrentUser();
        if (!currentUser || currentUser.isAdmin) {
            const result = { ...all };
            result.mcpServers = newSettings.mcpServers;
            result.users = newSettings.users;
            result.systemConfig = newSettings.systemConfig;
            result.groups = newSettings.groups;
            result.oauthClients = newSettings.oauthClients;
            result.oauthTokens = newSettings.oauthTokens;
            return result;
        }
        else {
            const result = JSON.parse(JSON.stringify(all));
            if (!result.userConfigs) {
                result.userConfigs = {};
            }
            const systemConfig = newSettings.systemConfig || {};
            const userConfig = {
                routing: systemConfig.routing
                    ? {
                    // TODO: only allow modifying certain fields based on userConfig permissions
                    }
                    : undefined,
            };
            result.userConfigs[currentUser?.username || ''] = userConfig;
            return result;
        }
    }
    getPermissions(user) {
        if (user && user.isAdmin) {
            return ['*', 'x'];
        }
        else {
            return [''];
        }
    }
}
//# sourceMappingURL=dataService.js.map
import fs from 'fs';
import { getConfigFilePath } from '../utils/path.js';
// Get path to the servers.json file
export const getServersJsonPath = () => {
    return getConfigFilePath('servers.json', 'Servers');
};
// Load all market servers from servers.json
export const getMarketServers = () => {
    try {
        const serversJsonPath = getServersJsonPath();
        const data = fs.readFileSync(serversJsonPath, 'utf8');
        const serversObj = JSON.parse(data);
        // use key as name field
        Object.entries(serversObj).forEach(([key, server]) => {
            server.name = key;
        });
        const sortedEntries = Object.entries(serversObj).sort(([, serverA], [, serverB]) => {
            if (serverA.is_official && !serverB.is_official)
                return -1;
            if (!serverA.is_official && serverB.is_official)
                return 1;
            return 0;
        });
        return Object.fromEntries(sortedEntries);
    }
    catch (error) {
        console.error('Failed to load servers from servers.json:', error);
        return {};
    }
};
// Get a specific market server by name
export const getMarketServerByName = (name) => {
    const servers = getMarketServers();
    return servers[name] || null;
};
// Get all categories from market servers
export const getMarketCategories = () => {
    const servers = getMarketServers();
    const categories = new Set();
    Object.values(servers).forEach((server) => {
        server.categories?.forEach((category) => {
            categories.add(category);
        });
    });
    return Array.from(categories).sort();
};
// Get all tags from market servers
export const getMarketTags = () => {
    const servers = getMarketServers();
    const tags = new Set();
    Object.values(servers).forEach((server) => {
        server.tags?.forEach((tag) => {
            tags.add(tag);
        });
    });
    return Array.from(tags).sort();
};
// Search market servers by query
export const searchMarketServers = (query) => {
    const servers = getMarketServers();
    const searchTerms = query
        .toLowerCase()
        .split(' ')
        .filter((term) => term.length > 0);
    if (searchTerms.length === 0) {
        return Object.values(servers);
    }
    return Object.values(servers).filter((server) => {
        // Search in name, display_name, description, categories, and tags
        const searchableText = [
            server.name,
            server.display_name,
            server.description,
            ...(server.categories || []),
            ...(server.tags || []),
        ]
            .join(' ')
            .toLowerCase();
        return searchTerms.some((term) => searchableText.includes(term));
    });
};
// Filter market servers by category
export const filterMarketServersByCategory = (category) => {
    const servers = getMarketServers();
    if (!category) {
        return Object.values(servers);
    }
    return Object.values(servers).filter((server) => {
        return server.categories?.includes(category);
    });
};
// Filter market servers by tag
export const filterMarketServersByTag = (tag) => {
    const servers = getMarketServers();
    if (!tag) {
        return Object.values(servers);
    }
    return Object.values(servers).filter((server) => {
        return server.tags?.includes(tag);
    });
};
//# sourceMappingURL=marketService.js.map
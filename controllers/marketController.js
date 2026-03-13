import { getMarketServers, getMarketServerByName, getMarketCategories, getMarketTags, searchMarketServers, filterMarketServersByCategory, filterMarketServersByTag, } from '../services/marketService.js';
// Get all market servers
export const getAllMarketServers = (_, res) => {
    try {
        const marketServers = Object.values(getMarketServers());
        const response = {
            success: true,
            data: marketServers,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get market servers information',
        });
    }
};
// Get a specific market server by name
export const getMarketServer = (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Server name is required',
            });
            return;
        }
        const server = getMarketServerByName(name);
        if (!server) {
            res.status(404).json({
                success: false,
                message: 'Market server not found',
            });
            return;
        }
        const response = {
            success: true,
            data: server,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get market server information',
        });
    }
};
// Get all market categories
export const getAllMarketCategories = (_, res) => {
    try {
        const categories = getMarketCategories();
        const response = {
            success: true,
            data: categories,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get market categories',
        });
    }
};
// Get all market tags
export const getAllMarketTags = (_, res) => {
    try {
        const tags = getMarketTags();
        const response = {
            success: true,
            data: tags,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get market tags',
        });
    }
};
// Search market servers
export const searchMarketServersByQuery = (req, res) => {
    try {
        const { query } = req.query;
        const searchQuery = typeof query === 'string' ? query : '';
        const servers = searchMarketServers(searchQuery);
        const response = {
            success: true,
            data: servers,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to search market servers',
        });
    }
};
// Filter market servers by category
export const getMarketServersByCategory = (req, res) => {
    try {
        const { category } = req.params;
        const servers = filterMarketServersByCategory(category);
        const response = {
            success: true,
            data: servers,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to filter market servers by category',
        });
    }
};
// Filter market servers by tag
export const getMarketServersByTag = (req, res) => {
    try {
        const { tag } = req.params;
        const servers = filterMarketServersByTag(tag);
        const response = {
            success: true,
            data: servers,
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to filter market servers by tag',
        });
    }
};
//# sourceMappingURL=marketController.js.map
import { getBearerKeyDao, getSystemConfigDao } from '../dao/index.js';
const requireAdmin = async (req, res) => {
    const systemConfigDao = getSystemConfigDao();
    const systemConfig = await systemConfigDao.get();
    if (systemConfig?.routing?.skipAuth) {
        return true;
    }
    const user = req.user;
    if (!user || !user.isAdmin) {
        res.status(403).json({
            success: false,
            message: 'Admin privileges required',
        });
        return false;
    }
    return true;
};
export const getBearerKeys = async (req, res) => {
    if (!(await requireAdmin(req, res)))
        return;
    try {
        const dao = getBearerKeyDao();
        const keys = await dao.findAll();
        const response = {
            success: true,
            data: keys,
        };
        res.json(response);
    }
    catch (error) {
        console.error('Failed to get bearer keys:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get bearer keys',
        });
    }
};
export const createBearerKey = async (req, res) => {
    if (!(await requireAdmin(req, res)))
        return;
    try {
        const { name, token, enabled, accessType, allowedGroups, allowedServers } = req.body;
        if (!name || typeof name !== 'string') {
            res.status(400).json({ success: false, message: 'Key name is required' });
            return;
        }
        if (!token || typeof token !== 'string') {
            res.status(400).json({ success: false, message: 'Token value is required' });
            return;
        }
        if (!accessType || !['all', 'groups', 'servers', 'custom'].includes(accessType)) {
            res.status(400).json({ success: false, message: 'Invalid accessType' });
            return;
        }
        const dao = getBearerKeyDao();
        const key = await dao.create({
            name,
            token,
            enabled: enabled ?? true,
            accessType,
            allowedGroups: Array.isArray(allowedGroups) ? allowedGroups : [],
            allowedServers: Array.isArray(allowedServers) ? allowedServers : [],
        });
        const response = {
            success: true,
            data: key,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Failed to create bearer key:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create bearer key',
        });
    }
};
export const updateBearerKey = async (req, res) => {
    if (!(await requireAdmin(req, res)))
        return;
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Key id is required' });
            return;
        }
        const { name, token, enabled, accessType, allowedGroups, allowedServers } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (token !== undefined)
            updates.token = token;
        if (enabled !== undefined)
            updates.enabled = enabled;
        if (accessType !== undefined) {
            if (!['all', 'groups', 'servers', 'custom'].includes(accessType)) {
                res.status(400).json({ success: false, message: 'Invalid accessType' });
                return;
            }
            updates.accessType = accessType;
        }
        if (allowedGroups !== undefined) {
            updates.allowedGroups = Array.isArray(allowedGroups) ? allowedGroups : [];
        }
        if (allowedServers !== undefined) {
            updates.allowedServers = Array.isArray(allowedServers) ? allowedServers : [];
        }
        const dao = getBearerKeyDao();
        const updated = await dao.update(id, updates);
        if (!updated) {
            res.status(404).json({ success: false, message: 'Bearer key not found' });
            return;
        }
        const response = {
            success: true,
            data: updated,
        };
        res.json(response);
    }
    catch (error) {
        console.error('Failed to update bearer key:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update bearer key',
        });
    }
};
export const deleteBearerKey = async (req, res) => {
    if (!(await requireAdmin(req, res)))
        return;
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Key id is required' });
            return;
        }
        const dao = getBearerKeyDao();
        const deleted = await dao.delete(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Bearer key not found' });
            return;
        }
        const response = {
            success: true,
        };
        res.json(response);
    }
    catch (error) {
        console.error('Failed to delete bearer key:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete bearer key',
        });
    }
};
//# sourceMappingURL=bearerKeyController.js.map
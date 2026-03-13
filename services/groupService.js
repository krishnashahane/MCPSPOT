import { v4 as uuidv4 } from 'uuid';
import { notifyToolChanged } from './mcpService.js';
import { getDataService } from './services.js';
import { getGroupDao, getServerDao, getSystemConfigDao } from '../dao/index.js';
// Helper function to normalize group servers configuration
const normalizeGroupServers = (servers) => {
    return servers.map((server) => {
        if (typeof server === 'string') {
            // Backward compatibility: string format means all tools
            return { name: server, tools: 'all' };
        }
        // New format: ensure tools defaults to 'all' if not specified
        return { name: server.name, tools: server.tools || 'all' };
    });
};
// Get all groups
export const getAllGroups = async () => {
    const groupDao = getGroupDao();
    const groups = await groupDao.findAll();
    const dataService = getDataService();
    return dataService.filterData ? dataService.filterData(groups) : groups;
};
// Get group by ID or name
export const getGroupByIdOrName = async (key) => {
    const systemConfigDao = getSystemConfigDao();
    const systemConfig = await systemConfigDao.get();
    const routingConfig = {
        enableGlobalRoute: systemConfig?.routing?.enableGlobalRoute ?? true,
        enableGroupNameRoute: systemConfig?.routing?.enableGroupNameRoute ?? true,
    };
    const groups = await getAllGroups();
    return (groups.find((group) => group.id === key || (group.name === key && routingConfig.enableGroupNameRoute)) || undefined);
};
// Create a new group
export const createGroup = async (name, description, servers = [], owner) => {
    try {
        const groupDao = getGroupDao();
        const serverDao = getServerDao();
        // Check if group with same name already exists
        const existingGroup = await groupDao.findByName(name);
        if (existingGroup) {
            return null;
        }
        // Normalize servers configuration and filter out non-existent servers
        const normalizedServers = normalizeGroupServers(servers);
        const allServers = await serverDao.findAll();
        const serverNames = new Set(allServers.map((s) => s.name));
        const validServers = normalizedServers.filter((serverConfig) => serverNames.has(serverConfig.name));
        const newGroup = {
            id: uuidv4(),
            name,
            description,
            servers: validServers,
            owner: owner || 'admin',
        };
        const createdGroup = await groupDao.create(newGroup);
        return createdGroup;
    }
    catch (error) {
        console.error('Failed to create group:', error);
        return null;
    }
};
// Update an existing group
export const updateGroup = async (id, data) => {
    try {
        const groupDao = getGroupDao();
        const serverDao = getServerDao();
        const existingGroup = await groupDao.findById(id);
        if (!existingGroup) {
            return null;
        }
        // Check for name uniqueness if name is being updated
        if (data.name && data.name !== existingGroup.name) {
            const groupWithName = await groupDao.findByName(data.name);
            if (groupWithName) {
                return null;
            }
        }
        // If servers array is provided, validate server existence and normalize format
        if (data.servers) {
            const normalizedServers = normalizeGroupServers(data.servers);
            const allServers = await serverDao.findAll();
            const serverNames = new Set(allServers.map((s) => s.name));
            data.servers = normalizedServers.filter((serverConfig) => serverNames.has(serverConfig.name));
        }
        const updatedGroup = await groupDao.update(id, data);
        if (updatedGroup) {
            notifyToolChanged();
        }
        return updatedGroup;
    }
    catch (error) {
        console.error(`Failed to update group ${id}:`, error);
        return null;
    }
};
// Update servers in a group (batch update)
// Update group servers (maintaining backward compatibility)
export const updateGroupServers = async (groupId, servers) => {
    try {
        const groupDao = getGroupDao();
        const serverDao = getServerDao();
        const existingGroup = await groupDao.findById(groupId);
        if (!existingGroup) {
            return null;
        }
        // Normalize and filter out non-existent servers
        const normalizedServers = normalizeGroupServers(servers);
        const allServers = await serverDao.findAll();
        const serverNames = new Set(allServers.map((s) => s.name));
        const validServers = normalizedServers.filter((serverConfig) => serverNames.has(serverConfig.name));
        const updatedGroup = await groupDao.update(groupId, { servers: validServers });
        if (updatedGroup) {
            notifyToolChanged();
        }
        return updatedGroup;
    }
    catch (error) {
        console.error(`Failed to update servers for group ${groupId}:`, error);
        return null;
    }
};
// Delete a group
export const deleteGroup = async (id) => {
    try {
        const groupDao = getGroupDao();
        return await groupDao.delete(id);
    }
    catch (error) {
        console.error(`Failed to delete group ${id}:`, error);
        return false;
    }
};
// Add server to group
export const addServerToGroup = async (groupId, serverName) => {
    try {
        const groupDao = getGroupDao();
        const serverDao = getServerDao();
        // Verify server exists
        const server = await serverDao.findById(serverName);
        if (!server) {
            return null;
        }
        const group = await groupDao.findById(groupId);
        if (!group) {
            return null;
        }
        const normalizedServers = normalizeGroupServers(group.servers);
        // Add server to group if not already in it
        if (!normalizedServers.some((s) => s.name === serverName)) {
            normalizedServers.push({ name: serverName, tools: 'all' });
            const updatedGroup = await groupDao.update(groupId, { servers: normalizedServers });
            if (updatedGroup) {
                notifyToolChanged();
            }
            return updatedGroup;
        }
        notifyToolChanged();
        return group;
    }
    catch (error) {
        console.error(`Failed to add server ${serverName} to group ${groupId}:`, error);
        return null;
    }
};
// Remove server from group
export const removeServerFromGroup = async (groupId, serverName) => {
    try {
        const groupDao = getGroupDao();
        const group = await groupDao.findById(groupId);
        if (!group) {
            return null;
        }
        const normalizedServers = normalizeGroupServers(group.servers);
        const filteredServers = normalizedServers.filter((server) => server.name !== serverName);
        return await groupDao.update(groupId, { servers: filteredServers });
    }
    catch (error) {
        console.error(`Failed to remove server ${serverName} from group ${groupId}:`, error);
        return null;
    }
};
// Get all servers in a group
export const getServersInGroup = async (groupId) => {
    const group = await getGroupByIdOrName(groupId);
    if (!group)
        return [];
    const normalizedServers = normalizeGroupServers(group.servers);
    return normalizedServers.map((server) => server.name);
};
// Get server configuration from group (including tool selection)
export const getServerConfigInGroup = async (groupId, serverName) => {
    const group = await getGroupByIdOrName(groupId);
    if (!group)
        return undefined;
    const normalizedServers = normalizeGroupServers(group.servers);
    return normalizedServers.find((server) => server.name === serverName);
};
// Get all server configurations in a group
export const getServerConfigsInGroup = async (groupId) => {
    const group = await getGroupByIdOrName(groupId);
    if (!group)
        return [];
    return normalizeGroupServers(group.servers);
};
// Update tools selection for a specific server in a group
export const updateServerToolsInGroup = async (groupId, serverName, tools) => {
    try {
        const groupDao = getGroupDao();
        const serverDao = getServerDao();
        const group = await groupDao.findById(groupId);
        if (!group) {
            return null;
        }
        // Verify server exists
        const server = await serverDao.findById(serverName);
        if (!server) {
            return null;
        }
        const normalizedServers = normalizeGroupServers(group.servers);
        const serverIndex = normalizedServers.findIndex((s) => s.name === serverName);
        if (serverIndex === -1) {
            return null; // Server not in group
        }
        // Update the tools configuration for the server
        normalizedServers[serverIndex].tools = tools;
        const updatedGroup = await groupDao.update(groupId, { servers: normalizedServers });
        if (updatedGroup) {
            notifyToolChanged();
        }
        return updatedGroup;
    }
    catch (error) {
        console.error(`Failed to update tools for server ${serverName} in group ${groupId}:`, error);
        return null;
    }
};
//# sourceMappingURL=groupService.js.map
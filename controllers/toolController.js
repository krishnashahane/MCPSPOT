import { handleCallToolRequest, getServerByName } from '../services/mcpService.js';
import { convertParametersToTypes } from '../utils/parameterConversion.js';
import { getNameSeparator } from '../config/index.js';
/**
 * Call a specific tool with given arguments
 */
export const callTool = async (req, res) => {
    try {
        const { server } = req.params;
        const { toolName, arguments: toolArgs = {} } = req.body;
        if (!toolName) {
            res.status(400).json({
                success: false,
                message: 'toolName is required',
            });
            return;
        }
        // Get the server info to access the tool's input schema
        const serverInfo = getServerByName(server);
        let inputSchema = {};
        if (serverInfo) {
            // Find the tool in the server's tools list
            const fullToolName = `${server}${getNameSeparator()}${toolName}`;
            const tool = serverInfo.tools.find((t) => t.name === fullToolName || t.name === toolName);
            if (tool && tool.inputSchema) {
                inputSchema = tool.inputSchema;
            }
        }
        // Convert parameters to proper types based on the tool's input schema
        const convertedArgs = convertParametersToTypes(toolArgs, inputSchema);
        // Create a mock request structure for handleCallToolRequest
        const mockRequest = {
            params: {
                name: 'call_tool',
                arguments: {
                    toolName,
                    arguments: convertedArgs,
                },
            },
        };
        const extra = {
            sessionId: req.headers['x-session-id'] || 'api-session',
            server: server || undefined,
            headers: req.headers, // Include request headers for passthrough
        };
        const result = (await handleCallToolRequest(mockRequest, extra));
        const response = {
            success: true,
            data: {
                content: result.content || [],
                toolName,
                arguments: convertedArgs,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error calling tool:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to call tool',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
};
//# sourceMappingURL=toolController.js.map
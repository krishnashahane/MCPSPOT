import { handleGetPromptRequest } from '../services/mcpService.js';
/**
 * Get a specific prompt by server and prompt name
 */
export const getPrompt = async (req, res) => {
    try {
        // Decode URL-encoded parameters to handle slashes in server/prompt names
        const serverName = decodeURIComponent(req.params.serverName);
        const promptName = decodeURIComponent(req.params.promptName);
        if (!serverName || !promptName) {
            res.status(400).json({
                success: false,
                message: 'serverName and promptName are required',
            });
            return;
        }
        const promptArgs = {
            params: req.body,
        };
        const result = await handleGetPromptRequest(promptArgs, serverName);
        if (result.isError) {
            res.status(500).json({
                success: false,
                message: 'Failed to get prompt',
            });
            return;
        }
        const response = {
            success: true,
            data: result,
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error getting prompt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get prompt',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
};
//# sourceMappingURL=promptController.js.map
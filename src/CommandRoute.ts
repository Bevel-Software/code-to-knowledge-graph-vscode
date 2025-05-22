import { Router, Request, Response } from 'express';
import { BatchProcessor } from './BatchProcessor';
import { BatchNodeRequestResponse, VsCodeCommand } from './data/VsCodeCommand';
import { executeCommand } from './ParsingSocket';
import * as vscode from 'vscode';

const commandRouter = Router();

commandRouter.post("/command", async (req: Request, res: Response): Promise<void> => {
    const json = req.body;
    if(json instanceof Array) {
        const processor = new BatchProcessor({
            input: json,
            processItemAsync: async (item) => {
                const command = new VsCodeCommand(item.command, item.args);
                return await executeCommand(command);
            },
            onError: (error, item, index) => {
                console.error(`Error executing command at index ${index}:`, error);
            }
        });

        const results = await processor.process();

        res.status(200).json(new BatchNodeRequestResponse(results));
        return;
    }

    const command = new VsCodeCommand(json.command, json.args);
    const result = await executeCommand(command);

    res.status(200).json(result);
})

interface ShowMessageRequest {
    message: string
}

commandRouter.post("/showMessage", async (req: Request<{}, {}, ShowMessageRequest, {}>, res: Response): Promise<void> => {
    vscode.window.showInformationMessage(`${req.body.message}`);
    res.status(200);
})

commandRouter.get("/isAlive", (req, res) => {
    res.status(200).send(true);
})

export default commandRouter;
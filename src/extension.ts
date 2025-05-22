import * as vscode from 'vscode';
import { RestServer } from './RestServer';
import { BevelFilesPathResolver } from './BevelFilesPathResolver';

export function activate(context: vscode.ExtensionContext) {
    initRestServer(context);
}

async function initRestServer(context: vscode.ExtensionContext) {
    if(vscode.workspace.workspaceFolders) {
        const portFile = vscode.Uri.file(BevelFilesPathResolver.bevelPortFilePath(vscode.workspace.workspaceFolders[0].uri.fsPath))
        try {
            vscode.workspace.fs.stat(portFile);
            const port = parseInt(new TextDecoder().decode(await vscode.workspace.fs.readFile(portFile)));
            // Check if there is a running server on this port, by checking the localhost:port/api/isAlive
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            try {
                let result = await fetch(`http://localhost:${port}/api/isAlive`, { signal: controller.signal });
                if (result.ok) {
                    // Server is already running
                    return;
                }
            } catch {
                // No server is alive, continue
            } finally {
                clearTimeout(timeoutId);
            }
        } catch {
            // Port file does not exist, continue
        }
    }
    const rest = new RestServer();
    context.subscriptions.push(rest);
    rest.start().then(() => {
        if(vscode.workspace.workspaceFolders) {
            const portFile = vscode.Uri.file(BevelFilesPathResolver.bevelPortFilePath(vscode.workspace.workspaceFolders[0].uri.fsPath))
            vscode.workspace.fs.writeFile(portFile, new TextEncoder().encode("" + rest.port));
        }
    });
}
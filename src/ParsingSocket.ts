import * as vscode from "vscode";
import { VsCodeCommand, VsCodeSymbolInformationResponse, VsCodeLocationResponse, VsCodeDocumentSymbolResponse, VsCodeBatchLocationsResponse, VsCodeBatchRequest, VsCodeBatchLocationResponse, BatchNodeRequestResponse } from "./data/VsCodeCommand";
import { VsCodeLocation } from './data/VsCodeLocation';
import { VsCodeSymbolInformation } from './data/VsCodeSymbolInformation';
import { VsCodeDocumentSymbol } from "./data/VsCodeDocumentSymbol";
import { BatchProcessor } from './BatchProcessor';

export async function executeCommand(command: VsCodeCommand): Promise<any> {
    try {
        if (command.command == "vscode.executeReferenceProvider") {
            let locations: vscode.Location[] = await vscode.commands.executeCommand(command.command, vscode.Uri.file(command.args[0].filePath), new vscode.Position(command.args[0].range.startLine, command.args[0].range.startCharacter));
            return new VsCodeLocationResponse(locations.map(location => VsCodeLocation.fromLocation(location)));
        } else if (command.command == "vscode.executeReferenceProviderInBatch") {
            let input: VsCodeBatchRequest[] = command.args[0];
            
            const processor = new BatchProcessor({
                input: input,
                batchSize: 100,
                processItemAsync: async (item, index) => {
                    const locations = await vscode.commands.executeCommand(
                        "vscode.executeReferenceProvider",
                        vscode.Uri.file(item.symbol.location.filePath),
                        new vscode.Position(item.symbol.location.range.startLine, item.symbol.location.range.startCharacter)
                    ) as vscode.Location[];
                    return locations;
                },
                onError: (error, item, index) => {
                    console.error(`Error executing reference provider for ${item.nodeName} at index ${index}:`, error);
                }
            });

            let allLocations = await processor.process();
            
            return new VsCodeBatchLocationsResponse(
                input.map((item, i) => new VsCodeBatchLocationResponse(
                    item.nodeName,
                    allLocations[i].map(location => VsCodeLocation.fromLocation(location))
                ))
            );
        } else if(command.command == "vscode.executeWorkspaceSymbolProvider") {
            let symbolInfo: vscode.SymbolInformation[] = await vscode.commands.executeCommand(command.command, ...command.args);
            return new VsCodeSymbolInformationResponse(symbolInfo.map(symbol => VsCodeSymbolInformation.fromSymbolInformation(symbol)));
        } else if(command.command == "vscode.executeDocumentSymbolProvider") {
            return await handleExecuteDocumentSymbolProvider(command);
        } else if(command.command == "progressUpdate") {
            // NO OP
        } else if(command.command == "showInformationMessage") {
            vscode.window.showInformationMessage(command.args[0]);
        } else if(command.command == "showErrorMessage") {
            vscode.window.showErrorMessage(command.args[0]);
        } else if(command.command == "vscode.executeDefinitionProvider") {
            let locations: vscode.Location[] = await vscode.commands.executeCommand(command.command, vscode.Uri.file(command.args[0].filePath), new vscode.Position(command.args[0].range.startLine, command.args[0].range.startCharacter));
            return new VsCodeLocationResponse(
                locations.map(location => VsCodeLocation.fromLocation(location)));
        } else if(command.command == "updateStatusBarItem") {
            // NO OP
        } else {
            let result = await vscode.commands.executeCommand(command.command, ...command.args);
            return result;
        }
    } catch (error) {
        console.error(`[ERROR] Failed to execute command: `, command, error);
    }
    return null;
}

const openFileExtensions: Set<string> = new Set<string>();

async function handleExecuteDocumentSymbolProvider(command: VsCodeCommand): Promise<any> {
    try {
        let symbols: any[] = await vscode.commands.executeCommand(command.command, vscode.Uri.file(command.args[0]));
        let tries: number = 0
        while(symbols === undefined && tries < 8) {
            tries++;
            let fileName = command.args[0]
            let fileExtension = fileName.split('.').pop();
            if(!openFileExtensions.has(fileExtension)) {
                openFileExtensions.add(fileExtension);
                console.log(`[DEBUG] Opening file: ${command.args[0]}`, command, vscode.Uri.file(command.args[0]));
                try {
                    await vscode.window.showTextDocument(vscode.Uri.file(command.args[0]), {preview: false});
                } catch (error) {
                    console.error(`[ERROR] Failed to open file: ${error}`);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            symbols = await vscode.commands.executeCommand(command.command, vscode.Uri.file(command.args[0]));
        }
        if(symbols !== null && symbols !== undefined && symbols.length > 0) {
            //console.log(Object.hasOwn(symbols[0], "children"));
            if(!Object.hasOwn(symbols[0], "children")) {
                return new VsCodeSymbolInformationResponse(symbols.map(symbol => VsCodeSymbolInformation.fromSymbolInformation(symbol)));
            } else {
                return new VsCodeDocumentSymbolResponse(symbols.map(symbol => VsCodeDocumentSymbol.fromDocumentSymbol(symbol)));
            }
        }
    } catch (error) {
        console.error(`[ERROR] Failed to execute document symbol provider: ${error}`, command);
    }
    return new VsCodeDocumentSymbolResponse([]);
}
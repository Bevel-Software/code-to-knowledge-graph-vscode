import * as vscode from 'vscode';
import { VsCodeLocation } from './VsCodeLocation';


export class VsCodeSymbolInformation {
    constructor(
        public name: string,
        public kind: vscode.SymbolKind,
        public containerName: string,
        public location: VsCodeLocation
    ) { }

    static fromSymbolInformation(symbolInformation: vscode.SymbolInformation): VsCodeSymbolInformation {
        return new VsCodeSymbolInformation(
            symbolInformation.name,
            symbolInformation.kind,
            symbolInformation.containerName,
            VsCodeLocation.fromLocation(symbolInformation.location)
        );
    }
}

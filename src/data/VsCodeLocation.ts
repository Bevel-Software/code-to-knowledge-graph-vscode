import * as vscode from 'vscode';


export class VsCodeLocation {
    constructor(public filePath: string, public range: VsCodeRange) { }

    static fromLocation(location: any): VsCodeLocation {
        if(location.targetUri !== undefined) {
            return new VsCodeLocation(
                location.targetUri.fsPath,
                VsCodeRange.fromRange(location.targetRange)
            );
        }
        return new VsCodeLocation(
            location.uri.fsPath,
            VsCodeRange.fromRange(location.range)
        );
    }
}

export class VsCodeRange {
    constructor(public startLine: number, public startCharacter: number, public endLine: number, public endCharacter: number) { }

    static fromRange(range: vscode.Range): VsCodeRange {
        return new VsCodeRange(range.start.line, range.start.character, range.end.line, range.end.character);
    }
}
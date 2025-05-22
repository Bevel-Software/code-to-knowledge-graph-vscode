import { DocumentSymbol, SymbolKind } from "vscode";
import { VsCodeRange } from "./VsCodeLocation";

export class VsCodeDocumentSymbol {
    constructor(
        public children: VsCodeDocumentSymbol[],
        public name: string,
        public detail: string,
        public kind: SymbolKind,
        public range: VsCodeRange,
        public selectionRange: VsCodeRange
    ) { }

    static fromDocumentSymbol(documentSymbol: DocumentSymbol): VsCodeDocumentSymbol {
        return new VsCodeDocumentSymbol(
            documentSymbol.children.map(child => VsCodeDocumentSymbol.fromDocumentSymbol(child)),
            documentSymbol.name,
            documentSymbol.detail,
            documentSymbol.kind,
            VsCodeRange.fromRange(documentSymbol.range),
            VsCodeRange.fromRange(documentSymbol.selectionRange)
        );
    }
}

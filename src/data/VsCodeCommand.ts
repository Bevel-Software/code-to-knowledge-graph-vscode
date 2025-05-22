import { VsCodeSymbolInformation } from './VsCodeSymbolInformation';
import { VsCodeLocation } from './VsCodeLocation';
import { VsCodeDocumentSymbol } from './VsCodeDocumentSymbol';

export class VsCodeCommand{
    constructor(public command: string, public args: any[]) {}
}

export class BatchNodeRequestResponse{
    constructor(public commands: any[]) {}
}

export class VsCodeSymbolInformationResponse {
    constructor(public symbolMatches: VsCodeSymbolInformation[]) {}
}

export class VsCodeLocationResponse {
    constructor(public locations: VsCodeLocation[]) {}
}

export class VsCodeBatchLocationsResponse {
    constructor(public locationsList: VsCodeBatchLocationResponse[]) {}
}

export class VsCodeBatchLocationResponse {
    constructor(public nodeName: String, public locations: VsCodeLocation[]) {}
}

export class VsCodeBatchRequest {
    constructor(public nodeName: String, public symbol: VsCodeSymbolInformation) {}
}

export class VsCodeDocumentSymbolResponse {
    constructor(public documentSymbols: VsCodeDocumentSymbol[]) {}
}

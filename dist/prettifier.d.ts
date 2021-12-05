import { ContractStorageLayout } from "./types";
export declare class Prettify {
    table: ContractStorageLayout[];
    constructor(data: ContractStorageLayout[]);
    get(): ContractStorageLayout[];
    tabulateDiff(): void;
    toMarkdown(): Record<string, string> | undefined;
    tabulate(): void;
}
//# sourceMappingURL=prettifier.d.ts.map
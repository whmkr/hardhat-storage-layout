import { ContractStorageLayout } from "./types";
export declare class PrettifyDiff {
    table: ContractStorageLayout[];
    constructor(data: ContractStorageLayout[]);
    get(): ContractStorageLayout[];
    tabulate(): void;
    toMarkdown(): Record<string, string> | undefined;
}
export declare class PrettifyStorage {
    table: ContractStorageLayout[];
    constructor(data: ContractStorageLayout[]);
    get(): ContractStorageLayout[];
    toMarkdown(): Record<string, string> | undefined;
    tabulate(): void;
}
//# sourceMappingURL=prettifier.d.ts.map
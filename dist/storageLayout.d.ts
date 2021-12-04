import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { ContractStorageLayout } from "./types";
export declare class StorageLayout {
    env: HardhatRuntimeEnvironment;
    constructor(hre: HardhatRuntimeEnvironment);
    check(oldData: ContractStorageLayout, newData: ContractStorageLayout): Promise<void>;
    getLayout(contractNameOrFullyQualifiedName: string): Promise<ContractStorageLayout>;
    printAll(): Promise<void>;
    getData(): Promise<Array<ContractStorageLayout>>;
    exportData(data: ContractStorageLayout[]): Promise<void>;
    export(): Promise<void>;
}
//# sourceMappingURL=storageLayout.d.ts.map
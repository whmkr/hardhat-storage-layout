import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { ContractStorageLayout } from "./types";
export declare class StorageLayout {
    env: HardhatRuntimeEnvironment;
    constructor(hre: HardhatRuntimeEnvironment);
    check(oldData: ContractStorageLayout, newData: ContractStorageLayout): Promise<void>;
    getLayout(contractNameOrFullyQualifiedName: string): Promise<ContractStorageLayout>;
    print(contracts?: string[]): Promise<void>;
    getData(contracts?: string[]): Promise<Array<ContractStorageLayout>>;
    export(contracts?: string[]): Promise<void>;
}
//# sourceMappingURL=storageLayout.d.ts.map
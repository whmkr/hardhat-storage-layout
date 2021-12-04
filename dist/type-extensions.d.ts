import "hardhat/types/config";
import "hardhat/types/runtime";
import { StorageLayout } from "./storageLayout";
declare module "hardhat/types/config" {
    interface ProjectPathsUserConfig {
        newStorageLayoutPath?: string;
    }
    interface ProjectPathsConfig {
        newStorageLayoutPath: string;
    }
}
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        storageLayout: StorageLayout;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map
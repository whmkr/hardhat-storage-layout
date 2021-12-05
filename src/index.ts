import { TASK_CHECK } from "hardhat/builtin-tasks/task-names";
import { extendConfig, extendEnvironment, task } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import path from "path";

import { StorageLayout } from "./storageLayout";
import "./type-extensions";

export const PluginName = "hardhat-storage-layout";

task(TASK_CHECK).setAction(async (args, hre, runSuper) => {
  await hre.storageLayout.export();
  await runSuper(args);
});

task("storage-layout", "prints storage slot for all contracts").setAction(async(args, hre) => {
  await hre.storageLayout.export();
});

task("storage-check", "prints storage layout diff for updated contract")
  .addParam("original", "old contract name")
  .addParam("updated", "new contract name")
  .setAction( async(args, hre) => {
    const oldData = await hre.storageLayout.getLayout(args.original);
    const newData = await hre.storageLayout.getLayout(args.updated);
    await hre.storageLayout.check(oldData, newData);
  });

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const storageLayoutUserPath = userConfig.paths?.newStorageLayoutPath;
    let newStorageLayoutPath: string;

    if (storageLayoutUserPath === undefined) {
      newStorageLayoutPath = path.join(config.paths.root, "./storageLayout");
    } else {
      if (path.isAbsolute(storageLayoutUserPath)) {
        newStorageLayoutPath = storageLayoutUserPath;
      } else {
        newStorageLayoutPath = path.normalize(
          path.join(config.paths.root, storageLayoutUserPath)
        );
      }
    }

    config.paths.newStorageLayoutPath = newStorageLayoutPath;
    config.solidity.compilers = config.solidity.compilers.map(x => {
      if(x.settings.outputSelection["*"]["*"].find(x => x === "storageLayout") === undefined){
        x.settings.outputSelection["*"]["*"].push("storageLayout");
      }
      return x;
    });
    for(let k of Object.keys(config.solidity.overrides)){
      if(config.solidity.overrides[k].settings.outputSelection["*"]["*"].find(x => x === "storageLayout") === undefined) {
        config.solidity.overrides[k].settings.outputSelection["*"]["*"].push("storageLayout");
      }
    }
  }
);

extendEnvironment(hre => {
  hre.storageLayout = lazyObject(() => new StorageLayout(hre));
});

module.exports = {};

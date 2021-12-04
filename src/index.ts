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
    const userSoliditySetting = userConfig.solidity;

    if(typeof(userSoliditySetting) === 'string') {
      userSoliditySetting = {
        version: userSoliditySetting,
      }
    }
    if(userSoliditySetting.settings === undefined) {
      userSoliditySetting.settings = {};
    }

    userSoliditySetting.settings.outputSelection = {
      "*": {
        "*": ["storageLayout"],
      },
    };


    config.solidity = userSoliditySetting;

  }
);

extendEnvironment(hre => {
  hre.storageLayout = lazyObject(() => new StorageLayout(hre));
});

module.exports = {};

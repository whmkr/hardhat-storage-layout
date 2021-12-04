"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginName = void 0;
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const config_1 = require("hardhat/config");
const path_1 = __importDefault(require("path"));
const storageLayout_1 = require("./storageLayout");
require("./type-extensions");
exports.PluginName = "hardhat-storage-layout";
config_1.task(task_names_1.TASK_CHECK).setAction(async (args, hre, runSuper) => {
    await hre.storageLayout.export();
    await runSuper(args);
});
config_1.extendConfig((config, userConfig) => {
    var _a;
    const storageLayoutUserPath = (_a = userConfig.paths) === null || _a === void 0 ? void 0 : _a.newStorageLayoutPath;
    let newStorageLayoutPath;
    if (storageLayoutUserPath === undefined) {
        newStorageLayoutPath = path_1.default.join(config.paths.root, "./storageLayout");
    }
    else {
        if (path_1.default.isAbsolute(storageLayoutUserPath)) {
            newStorageLayoutPath = storageLayoutUserPath;
        }
        else {
            newStorageLayoutPath = path_1.default.normalize(path_1.default.join(config.paths.root, storageLayoutUserPath));
        }
    }
    config.paths.newStorageLayoutPath = newStorageLayoutPath;
    config.solidity.compilers = config.solidity.compilers.map(x => {
        if (x.settings.outputSelection["*"]["*"].find(x => x === "storageLayout") === undefined) {
            x.settings.outputSelection["*"]["*"].push("storageLayout");
        }
        return x;
    });
    for (let k of Object.keys(config.solidity.overrides)) {
        if (config.solidity.overrides[k].settings.outputSelection["*"]["*"].find(x => x === "storageLayout") === undefined) {
            config.solidity.overrides[k].settings.outputSelection["*"]["*"].push("storageLayout");
        }
    }
});
config_1.extendEnvironment(hre => {
    console.log(hre.storageLayout);
    hre.storageLayout = new storageLayout_1.StorageLayout(hre);
});
module.exports = {};
//# sourceMappingURL=index.js.map
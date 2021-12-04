"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageLayout = void 0;
const fs_1 = __importDefault(require("fs"));
const plugins_1 = require("hardhat/plugins");
const path_1 = __importDefault(require("path"));
const prettifier_1 = require("./prettifier");
class StorageLayout {
    constructor(hre) {
        this.env = hre;
    }
    //  public async diff() {
    //  }
    //
    //  public async getLayout( contractName : string) {
    //    const storageLayoutPath = this.env.config.paths.newStorageLayoutPath;
    //    const outputDirectory = path.resolve(storageLayoutPath);
    //    if (!outputDirectory.startsWith(this.env.config.paths.root)) {
    //      throw new HardhatPluginError(
    //        "output directory should be inside the project directory"
    //      );
    //    }
    //    if (!fs.existsSync(outputDirectory)) {
    //      fs.mkdirSync(outputDirectory);
    //    }
    //  }
    async export() {
        const storageLayoutPath = this.env.config.paths.newStorageLayoutPath;
        const outputDirectory = path_1.default.resolve(storageLayoutPath);
        if (!outputDirectory.startsWith(this.env.config.paths.root)) {
            throw new plugins_1.HardhatPluginError("output directory should be inside the project directory");
        }
        if (!fs_1.default.existsSync(outputDirectory)) {
            fs_1.default.mkdirSync(outputDirectory);
        }
        const data = { contracts: [] };
        for (const fullName of await this.env.artifacts.getAllFullyQualifiedNames()) {
            const { sourceName, contractName } = await this.env.artifacts.readArtifact(fullName);
            for (const artifactPath of await this.env.artifacts.getBuildInfoPaths()) {
                const artifact = fs_1.default.readFileSync(artifactPath);
                const artifactJsonABI = JSON.parse(artifact.toString());
                try {
                    if (!artifactJsonABI.output.contracts[sourceName][contractName] &&
                        !artifactJsonABI.output.contracts[sourceName][contractName].storageLayout) {
                        continue;
                    }
                }
                catch (e) {
                    continue;
                }
                const contract = { name: contractName, stateVariables: [] };
                for (const stateVariable of artifactJsonABI.output.contracts[sourceName][contractName].storageLayout.storage) {
                    contract.stateVariables.push({
                        name: stateVariable.label,
                        slot: stateVariable.slot,
                        offset: stateVariable.offset,
                        type: stateVariable.type
                    });
                }
                data.contracts.push(contract);
                // TODO: export the storage layout to the ./storageLayout/output.md
            }
        }
        const prettifier = new prettifier_1.Prettify(data.contracts);
        prettifier.tabulate();
    }
}
exports.StorageLayout = StorageLayout;
//# sourceMappingURL=storageLayout.js.map
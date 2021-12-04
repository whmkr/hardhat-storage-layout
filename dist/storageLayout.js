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
    async check(oldData, newData) {
        // TODO: check
        // if variable name changed => yellow
        // if variable type changed => red
    }
    async getLayout(contractNameOrFullyQualifiedName) {
        const { sourceName, contractName } = await this.env.artifacts.readArtifact(contractNameOrFullyQualifiedName);
        const fullyQualifiedName = `${sourceName}:${contractName}`;
        const buildJson = await this.env.artifacts.getBuildInfo(fullyQualifiedName);
        const contract = { name: contractName, stateVariables: [] };
        for (const stateVariable of buildJson.output.contracts[sourceName][contractName].storageLayout.storage) {
            contract.stateVariables.push({
                name: stateVariable.label,
                slot: stateVariable.slot,
                offset: stateVariable.offset,
                type: stateVariable.type
            });
        }
        return contract;
    }
    async printAll() {
        const data = await this.getData();
        const prettifier = new prettifier_1.Prettify(data);
        prettifier.tabulate();
    }
    async getData() {
        const data = [];
        for (const fullName of await this.env.artifacts.getAllFullyQualifiedNames()) {
            const contract = await this.getLayout(fullName);
            data.push(contract);
        }
        return data;
    }
    async exportData(data) {
        const prettifier = new prettifier_1.Prettify(data);
        prettifier.tabulate();
    }
    async export() {
        const storageLayoutPath = this.env.config.paths.newStorageLayoutPath;
        const outputDirectory = path_1.default.resolve(storageLayoutPath);
        if (!outputDirectory.startsWith(this.env.config.paths.root)) {
            throw new plugins_1.HardhatPluginError("output directory should be inside the project directory");
        }
        if (!fs_1.default.existsSync(outputDirectory)) {
            fs_1.default.mkdirSync(outputDirectory);
        }
        const data = await this.getData();
        await this.exportData(data);
        // TODO: export the storage layout to the ./storageLayout/output.md
    }
}
exports.StorageLayout = StorageLayout;
//# sourceMappingURL=storageLayout.js.map
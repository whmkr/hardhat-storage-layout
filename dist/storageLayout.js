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
const types_1 = require("./types");
class StorageLayout {
    constructor(hre) {
        this.env = hre;
    }
    async check(oldData, newData) {
        // TODO
        // 1. add log level
        // 2. add assertion on error
        // 3. (Optional) etherscan support for oldData
        let diff = { name: `diff ${oldData.name} -> ${newData.name}`, stateVariables: [] };
        let res = [];
        // non-zero slots
        for (const oldVariable of oldData.stateVariables) {
            const bitStart = (+oldVariable.slot) * 256 + (+oldVariable.offset);
            for (const updatedVariable of newData.stateVariables) {
                const updatedBitStart = (+updatedVariable.slot) * 256 + (+updatedVariable.offset);
                if (bitStart >= updatedBitStart + (+updatedVariable.length) || bitStart + (+oldVariable.length) <= updatedBitStart) {
                    // updateBit does not have common slot with given variable
                    continue;
                }
                // has some common slots
                // CASE 1 : everything is same (not considering name and type)
                if (updatedVariable.slot === oldVariable.slot &&
                    updatedVariable.offset === oldVariable.offset &&
                    updatedVariable.length === oldVariable.length) {
                    let resultVariable = {
                        name: updatedVariable.name,
                        slot: updatedVariable.slot,
                        offset: updatedVariable.offset,
                        length: updatedVariable.length,
                        type: updatedVariable.type,
                        color: "green",
                        changes: [],
                    };
                    // when name is different, print yellow 
                    updatedVariable.name === oldVariable.name ?
                        resultVariable.name = updatedVariable.name : (resultVariable.color = "yellow",
                        resultVariable.changes.push(types_1.VariableChange.Name),
                        resultVariable.name = `${oldVariable.name} -> ${updatedVariable.name}`);
                    // when type is different, print yellow 
                    updatedVariable.type === oldVariable.type ?
                        resultVariable.type = updatedVariable.type : (resultVariable.color = "yellow",
                        resultVariable.changes.push(types_1.VariableChange.Type),
                        resultVariable.type = `${oldVariable.type} -> ${updatedVariable.type}`);
                    res.push(resultVariable);
                    // no need to iterate any furhter
                    break;
                }
                let resultVariable = {
                    name: updatedVariable.name,
                    slot: updatedVariable.slot,
                    offset: updatedVariable.offset,
                    length: updatedVariable.length,
                    type: updatedVariable.type,
                    color: "red",
                    changes: [],
                };
                // when name is different
                updatedVariable.name === oldVariable.name ?
                    resultVariable.name = updatedVariable.name : (resultVariable.changes.push(types_1.VariableChange.Name),
                    resultVariable.name = `${oldVariable.name} -> ${updatedVariable.name}`);
                // when type is differentw 
                updatedVariable.type === oldVariable.type ?
                    resultVariable.type = updatedVariable.type : (resultVariable.changes.push(types_1.VariableChange.Type),
                    resultVariable.type = `${oldVariable.type} -> ${updatedVariable.type}`);
                // when length is different
                updatedVariable.length === oldVariable.length ?
                    resultVariable.length = updatedVariable.length : (resultVariable.changes.push(types_1.VariableChange.Length),
                    resultVariable.length = `${oldVariable.length} -> ${updatedVariable.length}`);
                // when offset is different
                updatedVariable.offset === oldVariable.offset ?
                    resultVariable.offset = updatedVariable.offset : (resultVariable.changes.push(types_1.VariableChange.Offset),
                    resultVariable.offset = `${oldVariable.offset} -> ${updatedVariable.offset}`);
                // when slot is different
                updatedVariable.slot === oldVariable.slot ?
                    resultVariable.slot = updatedVariable.slot : (resultVariable.changes.push(types_1.VariableChange.Slot),
                    resultVariable.slot = `${oldVariable.slot} -> ${updatedVariable.slot}`);
                res.push(resultVariable);
            }
        }
        // new slots
        const oldDataLast = oldData.stateVariables[oldData.stateVariables.length - 1];
        const lastIndex = ((+oldDataLast.slot) * 256) + (+oldDataLast.offset) + (+oldDataLast.length);
        for (const updatedVariable of newData.stateVariables) {
            if ((+updatedVariable.slot) * 256 + (+updatedVariable.offset) >= lastIndex) {
                let resultVariable = {
                    name: updatedVariable.name,
                    slot: updatedVariable.slot,
                    offset: updatedVariable.offset,
                    length: updatedVariable.length,
                    type: updatedVariable.type,
                    color: "green",
                    changes: [types_1.VariableChange.NewSlot],
                };
                res.push(resultVariable);
            }
        }
        //print
        diff.stateVariables = res;
        const prettifier = new prettifier_1.PrettifyDiff([diff]);
        prettifier.tabulate();
    }
    async getLayout(contractNameOrFullyQualifiedName) {
        const { sourceName, contractName } = await this.env.artifacts.readArtifact(contractNameOrFullyQualifiedName);
        const fullyQualifiedName = `${sourceName}:${contractName}`;
        const buildJson = await this.env.artifacts.getBuildInfo(fullyQualifiedName);
        const contract = { name: contractName, stateVariables: [] };
        const layout = buildJson.output.contracts[sourceName][contractName].storageLayout;
        for (const stateVariable of layout.storage) {
            contract.stateVariables.push({
                name: stateVariable.label,
                type: stateVariable.type,
                slot: stateVariable.slot,
                offset: stateVariable.offset,
                length: ((+layout.types[stateVariable.type].numberOfBytes) * 8).toString()
            });
        }
        return contract;
    }
    async print(contracts) {
        const data = await this.getData();
        const prettifier = new prettifier_1.PrettifyStorage(data);
        prettifier.tabulate();
    }
    async getData(contracts) {
        // if contracts === null, get all data
        const data = [];
        if (contracts === undefined) {
            for (const fullName of await this.env.artifacts.getAllFullyQualifiedNames()) {
                const contract = await this.getLayout(fullName);
                data.push(contract);
            }
        }
        else {
            for (const name of contracts) {
                const contract = await this.getLayout(name);
                data.push(contract);
            }
        }
        return data;
    }
    async export(contracts) {
        const storageLayoutPath = this.env.config.paths.newStorageLayoutPath;
        const outputDirectory = path_1.default.resolve(storageLayoutPath);
        if (!outputDirectory.startsWith(this.env.config.paths.root)) {
            throw new plugins_1.HardhatPluginError("output directory should be inside the project directory");
        }
        if (!fs_1.default.existsSync(outputDirectory)) {
            fs_1.default.mkdirSync(outputDirectory);
        }
        const data = await this.getData();
        const prettifier = new prettifier_1.PrettifyStorage(data);
        const markdown = prettifier.toMarkdown();
        Object.keys(markdown).forEach((key) => {
            fs_1.default.writeFileSync(`${storageLayoutPath}/${key}.md`, markdown[key]);
        });
    }
}
exports.StorageLayout = StorageLayout;
//# sourceMappingURL=storageLayout.js.map
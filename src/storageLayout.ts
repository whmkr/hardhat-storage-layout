import fs from "fs";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import path from "path";

import { PrettifyStorage, PrettifyDiff } from "./prettifier";
import { VariableChange, StateVariable, ContractStorageLayout } from "./types";

export class StorageLayout {
  public env: HardhatRuntimeEnvironment;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.env = hre;
  }

  public async check( oldData: ContractStorageLayout, newData: ContractStorageLayout) {
    // TODO
    // 1. add log level
    // 2. add assertion on error
    // 3. (Optional) etherscan support for oldData
    let diff : ContractStorageLayout = { name : `diff ${oldData.name} -> ${newData.name}`, stateVariables:[] };

    let res : Array<StateVariable> = [];
    // non-zero slots
    for (const oldVariable of oldData.stateVariables) {
      const bitStart = (+oldVariable.slot) * 256 + (+oldVariable.offset);
      for( const updatedVariable of newData.stateVariables) {
        const updatedBitStart = (+updatedVariable.slot) * 256 + (+updatedVariable.offset);
        if(bitStart >= updatedBitStart + (+updatedVariable.length) || bitStart + (+oldVariable.length) <= updatedBitStart) {
          // updateBit does not have common slot with given variable
          continue;
        }
        // has some common slots
        // CASE 1 : everything is same (not considering name and type)
        if(
          updatedVariable.slot === oldVariable.slot &&
          updatedVariable.offset === oldVariable.offset &&
          updatedVariable.length === oldVariable.length
        ) {
          let resultVariable : StateVariable = {
            name : updatedVariable.name,
            slot : updatedVariable.slot,
            offset: updatedVariable.offset,
            length: updatedVariable.length,
            type: updatedVariable.type,
            color: "green",
            changes: [],
          }
          // when name is different, print yellow 
          updatedVariable.name === oldVariable.name ?
            resultVariable.name = updatedVariable.name : (
              resultVariable.color = "yellow",
              resultVariable.changes!.push(VariableChange.Name),
              resultVariable.name = `${oldVariable.name} -> ${updatedVariable.name}`
            );
          // when type is different, print yellow 
          updatedVariable.type === oldVariable.type ? 
            resultVariable.type = updatedVariable.type : (
              resultVariable.color = "yellow",
              resultVariable.changes!.push(VariableChange.Type),
              resultVariable.type = `${oldVariable.type} -> ${updatedVariable.type}`
            );
          res.push(resultVariable);
          // no need to iterate any furhter
          break;
        }
        let resultVariable :StateVariable= {
          name : updatedVariable.name,
          slot : updatedVariable.slot,
          offset: updatedVariable.offset,
          length: updatedVariable.length,
          type: updatedVariable.type,
          color: "red",
          changes: [],
        }
        // when name is different
        updatedVariable.name === oldVariable.name ?
          resultVariable.name = updatedVariable.name : (
            resultVariable.changes!.push(VariableChange.Name),
            resultVariable.name = `${oldVariable.name} -> ${updatedVariable.name}`
          );
        // when type is differentw 
        updatedVariable.type === oldVariable.type ? 
          resultVariable.type = updatedVariable.type : (
            resultVariable.changes!.push(VariableChange.Type),
            resultVariable.type = `${oldVariable.type} -> ${updatedVariable.type}`
          );
        // when length is different
        updatedVariable.length === oldVariable.length ? 
          resultVariable.length = updatedVariable.length : (
            resultVariable.changes!.push(VariableChange.Length),
            resultVariable.length = `${oldVariable.length} -> ${updatedVariable.length}`
          );
        // when offset is different
        updatedVariable.offset === oldVariable.offset ? 
          resultVariable.offset = updatedVariable.offset : (
            resultVariable.changes!.push(VariableChange.Offset),
            resultVariable.offset = `${oldVariable.offset} -> ${updatedVariable.offset}`
          );
        // when slot is different
        updatedVariable.slot === oldVariable.slot ? 
          resultVariable.slot = updatedVariable.slot : (
            resultVariable.changes!.push(VariableChange.Slot),
            resultVariable.slot = `${oldVariable.slot} -> ${updatedVariable.slot}`
          );
        res.push(resultVariable);
      }
    }

    // new slots
    const oldDataLast = oldData.stateVariables[oldData.stateVariables.length - 1];
    const lastIndex = ((+oldDataLast.slot) * 256) + (+oldDataLast.offset) + (+oldDataLast.length);
    for( const updatedVariable of newData.stateVariables) {
      if((+updatedVariable.slot) * 256 + (+updatedVariable.offset) >= lastIndex) {
        let resultVariable :StateVariable= {
          name : updatedVariable.name,
          slot : updatedVariable.slot,
          offset: updatedVariable.offset,
          length: updatedVariable.length,
          type: updatedVariable.type,
          color: "green",
          changes: [VariableChange.NewSlot],
        }
        res.push(resultVariable);
      }
    }
  
    //print
    diff.stateVariables = res;
    const prettifier = new PrettifyDiff([diff]);
    prettifier.tabulate();
  }

  public async getLayout( contractNameOrFullyQualifiedName : string) : Promise<ContractStorageLayout>{
    const {
      sourceName,
      contractName
    } = await this.env.artifacts.readArtifact(contractNameOrFullyQualifiedName);
    const fullyQualifiedName =  `${sourceName}:${contractName}`
    const buildJson :any= await this.env.artifacts.getBuildInfo(fullyQualifiedName);

    const contract: ContractStorageLayout = { name: contractName, stateVariables: [] };
    const layout = buildJson!.output.contracts[sourceName][contractName].storageLayout;
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

  public async print(contracts?: string[]) {
    const data = await this.getData();
    const prettifier = new PrettifyStorage(data);
    prettifier.tabulate();
  }

  public async getData(contracts?: string[]) : Promise<Array<ContractStorageLayout>> {
    // if contracts === null, get all data
    const data: Array<ContractStorageLayout>= [];

    if(contracts === undefined) {
      for (const fullName of await this.env.artifacts.getAllFullyQualifiedNames()) {
        const contract = await this.getLayout(fullName);
        data.push(contract);
      }
    } else {
      for (const name of contracts) {
        const contract = await this.getLayout(name);
        data.push(contract);
      }
    }
    return data;
  }

  public async export(contracts?: string[]) {
    const storageLayoutPath = this.env.config.paths.newStorageLayoutPath;
    const outputDirectory = path.resolve(storageLayoutPath);
    if (!outputDirectory.startsWith(this.env.config.paths.root)) {
      throw new HardhatPluginError(
        "output directory should be inside the project directory"
      );
    }
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    const data = await this.getData();
    const prettifier = new PrettifyStorage(data);
    const markdown = prettifier.toMarkdown();
    Object.keys(markdown!).forEach((key) => {
      fs.writeFileSync(`${storageLayoutPath}/${key}.md`, markdown![key]);
    })
    console.log(markdown);
    // TODO: export the storage layout to the ./storageLayout/output.md
  }
}

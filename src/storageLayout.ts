import fs from "fs";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import path from "path";

import { Prettify } from "./prettifier";
import { ContractStorageLayout } from "./types";

export class StorageLayout {
  public env: HardhatRuntimeEnvironment;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.env = hre;
  }

  public async check( oldData: ContractStorageLayout, newData: ContractStorageLayout) {
    // TODO: check
    // if variable name changed => yellow
    // if variable type changed => red
  }

  public async getLayout( contractNameOrFullyQualifiedName : string) : Promise<ContractStorageLayout>{
    const {
      sourceName,
      contractName
    } = await this.env.artifacts.readArtifact(contractNameOrFullyQualifiedName);
    const fullyQualifiedName =  `${sourceName}:${contractName}`
    const buildJson :any= await this.env.artifacts.getBuildInfo(fullyQualifiedName);

    const contract: ContractStorageLayout = { name: contractName, stateVariables: [] };
    for (const stateVariable of buildJson!.output.contracts[
      sourceName
    ][contractName].storageLayout.storage) {
      contract.stateVariables.push({
        name: stateVariable.label,
        slot: stateVariable.slot,
        offset: stateVariable.offset,
        type: stateVariable.type
      });
    }

    return contract;
  }

  public async printAll() {
    const data = await this.getData();
    const prettifier = new Prettify(data);
    prettifier.tabulate();
  }

  public async getData() : Promise<Array<ContractStorageLayout>> {
    const data: Array<ContractStorageLayout>= [];

    for (const fullName of await this.env.artifacts.getAllFullyQualifiedNames()) {
      const contract = await this.getLayout(fullName);
      data.push(contract);
    }
    return data;
  }

  public async exportData(data: ContractStorageLayout[]) {
    const prettifier = new Prettify(data);
    prettifier.tabulate();
  }

  public async export() {
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
    await this.exportData(data);
    // TODO: export the storage layout to the ./storageLayout/output.md
  }
}

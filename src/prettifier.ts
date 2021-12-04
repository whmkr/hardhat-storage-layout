import { Table } from "console-table-printer";

import { ContractStorageLayout } from "./types";

export class Prettify {
  public table: ContractStorageLayout[];

  constructor(data: ContractStorageLayout[]) {
    this.table = data;
  }

  public get(): ContractStorageLayout[] {
    return this.table;
  }

  public tabulate() {
    if (!this.table.length) {
      console.error("Table has empty fields");
    } else {

      try {
        for (const contract of this.table) {
          const p = new Table({
            title: contract.name,
            columns: [
              { name: "state_variable", alignment: "left" },
              { name: "storage_slot", alignment: "center" },
              { name: "offset", alignment: "center" },
              { name: "type", alignment: "left" }
            ]
          });
          if(contract.stateVariables.length ==0){
            continue;
          }
          for (const stateVariable of contract.stateVariables) {
            p.addRow({
              state_variable: stateVariable.name,
              storage_slot: stateVariable.slot,
              offset: stateVariable.offset,
              type: stateVariable.type
            },{color: stateVariable.color?stateVariable.color:"white"});
          }
          p.printTable();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}

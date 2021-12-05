import { Table } from "console-table-printer";
import json2md from "json2md";

import { VariableChange, ContractStorageLayout } from "./types";
export class PrettifyDiff {
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
              { name: "type", alignment: "left" },
              { name: "storage_slot", alignment: "center" },
              { name: "offset", alignment: "center" },
              { name: "length", alignment: "center" },
              { name: "changes", alignment: "center" },
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
              type: stateVariable.type,
              length: stateVariable.length,
              changes: stateVariable.changes!.map((x) => VariableChange[x]).toString()
            },{color: stateVariable.color?stateVariable.color:"white"});
          }
          p.printTable();
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  public toMarkdown() : Record<string, string> | undefined{
    if (!this.table.length) {
      console.error("Table has empty fields");
    } else {

      try {
        let record : Record<string, string> = {};
        for (const contract of this.table) {
          const data : any[]= [
          ];
          if(contract.stateVariables.length ==0){
            continue;
          }
          for (const stateVariable of contract.stateVariables) {
            data.push({
              state_variable: stateVariable.name,
              storage_slot: stateVariable.slot,
              offset: stateVariable.offset,
              type: stateVariable.type,
              length: stateVariable.length,
              changes: stateVariable.changes!.map((x) => VariableChange[x]).toString()
            });
          }
          record[contract.name] = json2md([
            {
              table: {
                headers : ['state_variable', 'type', 'storage_slot', 'offset', 'length', 'changes'],
                aligns: ['left', 'left', 'center', 'center', 'center', 'center'],
                rows: data
              }
            }
          ]);
        }
        return record;
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export class PrettifyStorage {
  public table: ContractStorageLayout[];

  constructor(data: ContractStorageLayout[]) {
    this.table = data;
  }

  public get(): ContractStorageLayout[] {
    return this.table;
  }
  public toMarkdown() : Record<string, string> | undefined{
    if (!this.table.length) {
      console.error("Table has empty fields");
    } else {

      try {
        let record : Record<string, string> = {};
        for (const contract of this.table) {
          const data : any[]= [
          ];
          if(contract.stateVariables.length ==0){
            continue;
          }
          for (const stateVariable of contract.stateVariables) {
            data.push({
              state_variable: stateVariable.name,
              storage_slot: stateVariable.slot,
              offset: stateVariable.offset,
              type: stateVariable.type,
              length: stateVariable.length
            });
          }
          record[contract.name] = json2md([
            {
              table: {
                headers : ['state_variable', 'type', 'storage_slot', 'offset', 'length'],
                aligns: ['left', 'left', 'center', 'center', 'center'],
                rows: data
              }
            }
          ]);
        }
        return record;
      } catch (e) {
        console.log(e);
      }
    }
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
              { name: "type", alignment: "left" },
              { name: "storage_slot", alignment: "center" },
              { name: "offset", alignment: "center" },
              { name: "length", alignment: "center" },
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
              type: stateVariable.type,
              length: stateVariable.length
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

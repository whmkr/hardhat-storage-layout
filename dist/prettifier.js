"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettifyStorage = exports.PrettifyDiff = void 0;
const console_table_printer_1 = require("console-table-printer");
const json2md_1 = __importDefault(require("json2md"));
const types_1 = require("./types");
class PrettifyDiff {
    constructor(data) {
        this.table = data;
    }
    get() {
        return this.table;
    }
    tabulate() {
        if (!this.table.length) {
            console.error("Table has empty fields");
        }
        else {
            try {
                for (const contract of this.table) {
                    const p = new console_table_printer_1.Table({
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
                    if (contract.stateVariables.length == 0) {
                        continue;
                    }
                    for (const stateVariable of contract.stateVariables) {
                        p.addRow({
                            state_variable: stateVariable.name,
                            storage_slot: stateVariable.slot,
                            offset: stateVariable.offset,
                            type: stateVariable.type,
                            length: stateVariable.length,
                            changes: stateVariable.changes.map((x) => types_1.VariableChange[x]).toString()
                        }, { color: stateVariable.color ? stateVariable.color : "white" });
                    }
                    p.printTable();
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    toMarkdown() {
        if (!this.table.length) {
            console.error("Table has empty fields");
        }
        else {
            try {
                let record = {};
                for (const contract of this.table) {
                    const data = [];
                    if (contract.stateVariables.length == 0) {
                        continue;
                    }
                    for (const stateVariable of contract.stateVariables) {
                        data.push({
                            state_variable: stateVariable.name,
                            storage_slot: stateVariable.slot,
                            offset: stateVariable.offset,
                            type: stateVariable.type,
                            length: stateVariable.length,
                            changes: stateVariable.changes.map((x) => types_1.VariableChange[x]).toString()
                        });
                    }
                    record[contract.name] = json2md_1.default([
                        {
                            table: {
                                headers: ['state_variable', 'type', 'storage_slot', 'offset', 'length', 'changes'],
                                aligns: ['left', 'left', 'center', 'center', 'center', 'center'],
                                rows: data
                            }
                        }
                    ]);
                }
                return record;
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
exports.PrettifyDiff = PrettifyDiff;
class PrettifyStorage {
    constructor(data) {
        this.table = data;
    }
    get() {
        return this.table;
    }
    toMarkdown() {
        if (!this.table.length) {
            console.error("Table has empty fields");
        }
        else {
            try {
                let record = {};
                for (const contract of this.table) {
                    const data = [];
                    if (contract.stateVariables.length == 0) {
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
                    record[contract.name] = json2md_1.default([
                        {
                            table: {
                                headers: ['state_variable', 'type', 'storage_slot', 'offset', 'length'],
                                aligns: ['left', 'left', 'center', 'center', 'center'],
                                rows: data
                            }
                        }
                    ]);
                }
                return record;
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    tabulate() {
        if (!this.table.length) {
            console.error("Table has empty fields");
        }
        else {
            try {
                for (const contract of this.table) {
                    const p = new console_table_printer_1.Table({
                        title: contract.name,
                        columns: [
                            { name: "state_variable", alignment: "left" },
                            { name: "type", alignment: "left" },
                            { name: "storage_slot", alignment: "center" },
                            { name: "offset", alignment: "center" },
                            { name: "length", alignment: "center" },
                        ]
                    });
                    if (contract.stateVariables.length == 0) {
                        continue;
                    }
                    for (const stateVariable of contract.stateVariables) {
                        p.addRow({
                            state_variable: stateVariable.name,
                            storage_slot: stateVariable.slot,
                            offset: stateVariable.offset,
                            type: stateVariable.type,
                            length: stateVariable.length
                        }, { color: stateVariable.color ? stateVariable.color : "white" });
                    }
                    p.printTable();
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}
exports.PrettifyStorage = PrettifyStorage;
//# sourceMappingURL=prettifier.js.map
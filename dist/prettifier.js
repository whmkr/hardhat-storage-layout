"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prettify = void 0;
const console_table_printer_1 = require("console-table-printer");
class Prettify {
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
                            { name: "storage_slot", alignment: "center" },
                            { name: "offset", alignment: "center" },
                            { name: "type", alignment: "left" }
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
                            type: stateVariable.type
                        });
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
exports.Prettify = Prettify;
//# sourceMappingURL=prettifier.js.map
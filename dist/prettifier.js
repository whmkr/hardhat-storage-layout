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
            console.error("Table has empty feilds");
        }
        else {
            const p = new console_table_printer_1.Table({
                columns: [
                    { name: "contract", alignment: "left" },
                    { name: "state_variable", alignment: "left" },
                    { name: "storage_slot", alignment: "center" },
                    { name: "offset", alignment: "center" },
                    { name: "type", alignment: "left" }
                ]
            });
            try {
                for (const contract of this.table) {
                    for (const stateVariable of contract.stateVariables) {
                        p.addRow({
                            contract: contract.name,
                            state_variable: stateVariable.name,
                            storage_slot: stateVariable.slot,
                            offset: stateVariable.offset,
                            type: stateVariable.type
                        });
                    }
                }
                p.printTable();
            }
            catch (e) {
                console.log(e); // TODO HRE error handler
            }
        }
    }
}
exports.Prettify = Prettify;
//# sourceMappingURL=prettifier.js.map
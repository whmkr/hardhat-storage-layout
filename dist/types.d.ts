export declare enum VariableChange {
    NewSlot = 0,
    Name = 1,
    Type = 2,
    Length = 3,
    Offset = 4,
    Slot = 5
}
export interface StateVariable {
    name: string;
    slot: string;
    offset: string;
    length: string;
    type: string;
    color?: string;
    changes?: VariableChange[];
}
export interface ContractStorageLayout {
    name: string;
    stateVariables: StateVariable[];
}
//# sourceMappingURL=types.d.ts.map
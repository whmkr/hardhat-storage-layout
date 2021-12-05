export declare enum VariableChange {
    NewSlot = 0,
    NameChange = 1,
    TypeChange = 2,
    LengthChange = 3,
    OffsetChange = 4,
    SlotChange = 5
}
export interface StateVariable {
    name: string;
    slot: string;
    offset: string;
    length: string;
    type: string;
    color?: string;
    change?: VariableChange[];
}
export interface ContractStorageLayout {
    name: string;
    stateVariables: StateVariable[];
}
//# sourceMappingURL=types.d.ts.map
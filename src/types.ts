export enum VariableChange {
    NewSlot,
    NameChange,
    TypeChange,
    LengthChange, 
    OffsetChange, 
    SlotChange,  
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

export enum VariableChange {
    NewSlot,
    Name,
    Type,
    Length, 
    Offset, 
    Slot,  
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

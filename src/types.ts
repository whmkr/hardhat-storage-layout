export interface StateVariable {
  name: string;
  slot: string;
  offset: number;
  type: string;
  color?: string;
}

export interface ContractStorageLayout {
  name: string;
  stateVariables: StateVariable[];
}

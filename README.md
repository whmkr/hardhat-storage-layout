# hardhat-storage-layout

<a href="https://www.npmjs.com/package/hardhat-storage-layout"><img alt="hardhat-storage-layout Version" src="https://img.shields.io/npm/v/hardhat-storage-layout"></a>

Generate Ethereum smart contract storage layout with Hardhat. This plugin saves time and avoids human error when a developer tries to update a specific `storage slot` in a remote solidity contract. For more info about the storage layout, please refer to the [official solidity documentation](https://docs.soliditylang.org/en/v0.6.8/internals/layout_in_storage.html).


## Installation

```bash
yarn add --dev hardhat-storage-layout
```

## Usage
- Add this plugin to `hardhat.config.js`:

```javascript
require('hardhat-storage-layout');
```
- Compile your contracts
- Export the contracts storage layout prior deployment as follows:

```shell
$ npx hardhat storage
```

or

```javascript
const hre = require("hardhat");
async function main() {
    ....
    await hre.storageLayout.export();
}
```

```
                               Greeter
┌────────────────┬──────────────────┬──────────────┬────────┬────────┐
│ state_variable │ type             │ storage_slot │ offset │ length │
├────────────────┼──────────────────┼──────────────┼────────┼────────┤
│ count          │ t_uint256        │      0       │   0    │  256   │
│ greeting       │ t_string_storage │      1       │   0    │  256   │
│ a              │ t_bool           │      2       │   0    │   8    │
│ b              │ t_uint128        │      2       │   1    │  128   │
│ c              │ t_uint128        │      3       │   0    │  128   │
└────────────────┴──────────────────┴──────────────┴────────┴────────┘
                                GreeterNew
┌────────────────┬───────────────────────┬──────────────┬────────┬────────┐
│ state_variable │ type                  │ storage_slot │ offset │ length │
├────────────────┼───────────────────────┼──────────────┼────────┼────────┤
│ name           │ t_string_storage      │      0       │   0    │  256   │
│ greetingnew    │ t_string_storage      │      1       │   0    │  256   │
│ a              │ t_struct(A)71_storage │      2       │   0    │  512   │
│ count          │ t_uint256             │      4       │   0    │  256   │
└────────────────┴───────────────────────┴──────────────┴────────┴────────┘
```

- **contract**: is the name of the contract including its path as prefix
- **state variable**: is the name of the state variable
- **offset**: is the offset in bytes within the storage slot according to the encoding
- **storage slot**: is the storage slot where the state variable resides or starts. This number may be very large and therefore its JSON value is represented as a string.
- **type**: is an identifier used as key to the variable’s type information (described in the following)
- **length**: size of the variable is occupying, represented in bit size(256 == 1slot)

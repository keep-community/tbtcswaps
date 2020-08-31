# Contracts
This is a standard truffle project that uses solidity ^0.6.0, so all the standard truffle commands are available, wrapped in npm commands:
```bash
npm install # Install dependencies
npm run build # Compile contracts
npm test # Run tests
npm run migrate # Deploy
```

## Design
The protocol and architecture of the system are explained on [the project's README](../README.md), whereas the smaller implementation decisions are described directly inside [the contract](./contracts/LN2tBTC.sol), in comment blocks.

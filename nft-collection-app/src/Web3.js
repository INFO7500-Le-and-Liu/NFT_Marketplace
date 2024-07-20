// src/web.js
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // local deploy
const privateKey = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const signer = new ethers.Wallet(privateKey, provider);

export { provider, signer };



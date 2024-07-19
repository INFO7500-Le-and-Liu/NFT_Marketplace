// src/web.js
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // local deploy
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const signer = new ethers.Wallet(privateKey, provider);

export { provider, signer };

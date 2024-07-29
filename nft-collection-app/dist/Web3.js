"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signer = exports.provider = void 0;
const ethers_1 = require("ethers");
const provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545'); // local deploy
exports.provider = provider;
const privateKey = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const signer = new ethers_1.ethers.Wallet(privateKey, provider);
exports.signer = signer;

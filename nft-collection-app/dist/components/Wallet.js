"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// src/components/Wallet.tsx
const react_1 = require("react");
const Web3_1 = require("../Web3");
function ConnectWallet() {
    const [connectedAccount, setConnectedAccount] = (0, react_1.useState)(null);
    const connectWallet = () => {
        const account = Web3_1.signer.address;
        setConnectedAccount(account);
    };
    return ((0, jsx_runtime_1.jsx)("div", { children: connectedAccount ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setConnectedAccount(null), children: "Disconnect" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Connected with ", (0, jsx_runtime_1.jsx)("strong", { children: connectedAccount })] })] })) : ((0, jsx_runtime_1.jsx)("button", { onClick: connectWallet, children: "Connect to Default Account" })) }));
}
exports.default = ConnectWallet;

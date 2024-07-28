"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// src/App.tsx
const react_1 = require("react");
const ethers_1 = require("ethers");
const Web3_1 = require("./Web3");
const Wallet_1 = __importDefault(require("./components/Wallet"));
const MintNFT_1 = __importDefault(require("./components/MintNFT"));
const DisplayNFT_1 = __importDefault(require("./components/DisplayNFT"));
const contract_json_1 = __importDefault(require("./abi/contract.json")); // 导入 ABI
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // 合约地址
const contractABI = contract_json_1.default.abi; // ABI
function App() {
    const [nfts, setNfts] = (0, react_1.useState)([]);
    const loadNFTs = async () => {
        try {
            const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, Web3_1.signer);
            const tokenIds = await contract.getAllTokens();
            const nftData = await Promise.all(tokenIds.map(async (tokenId) => {
                const tokenURI = await contract.tokenURI(tokenId);
                const response = await fetch(tokenURI);
                const metadata = await response.json();
                return { tokenId, ...metadata };
            }));
            setNfts(nftData);
        }
        catch (err) {
            console.error('Error loading NFTs:', err);
        }
    };
    (0, react_1.useEffect)(() => {
        loadNFTs();
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "App", children: [(0, jsx_runtime_1.jsx)(Wallet_1.default, {}), (0, jsx_runtime_1.jsx)(MintNFT_1.default, { contractAddress: contractAddress, contractABI: contractABI, loadNFTs: loadNFTs }), (0, jsx_runtime_1.jsx)(DisplayNFT_1.default, { nfts: nfts })] }));
}
exports.default = App;

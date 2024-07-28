"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ethers_1 = require("ethers");
const ipfsClient_1 = __importDefault(require("../services/ipfsClient"));
const Web3_1 = require("../Web3");
const MintNFT = ({ contractAddress, contractABI, loadNFTs }) => {
    const [file, setFile] = (0, react_1.useState)(null);
    const [name, setName] = (0, react_1.useState)('');
    const [description, setDescription] = (0, react_1.useState)('');
    const [price, setPrice] = (0, react_1.useState)('');
    const [minting, setMinting] = (0, react_1.useState)(false);
    const onFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    const uploadToIPFS = async (file) => {
        const result = await ipfsClient_1.default.add(file);
        return `https://ipfs.io/ipfs/${result.path}`;
    };
    const mintNFT = async () => {
        if (!file || !name || !description || !price)
            return;
        setMinting(true);
        try {
            const imageUrl = await uploadToIPFS(file);
            console.log('Image URI:', imageUrl);
            const metadata = {
                name,
                description,
                image: imageUrl,
            };
            const metadataResult = await ipfsClient_1.default.add(JSON.stringify(metadata));
            const metadataUrl = `https://ipfs.io/ipfs/${metadataResult.path}`;
            console.log('Metadata URL:', metadataUrl);
            const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, Web3_1.signer);
            const priceInWei = ethers_1.ethers.utils.parseEther(price);
            const transaction = await contract.mintNFT(metadataUrl, priceInWei);
            await transaction.wait();
            alert('NFT Minted!');
            loadNFTs();
            setFile(null);
            setName('');
            setDescription('');
            setPrice('');
        }
        catch (error) {
            console.error('Error minting NFT:', error);
        }
        finally {
            setMinting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: "file", onChange: onFileChange }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "NFT Name", value: name, onChange: (e) => setName(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "NFT Description", value: description, onChange: (e) => setDescription(e.target.value) }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "NFT Price in ETH", value: price, onChange: (e) => setPrice(e.target.value) }), (0, jsx_runtime_1.jsx)("button", { onClick: mintNFT, disabled: minting, children: minting ? 'Minting...' : 'Mint NFT' })] }));
};
exports.default = MintNFT;

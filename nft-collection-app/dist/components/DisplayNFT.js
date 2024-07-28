"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DisplayNFTs = ({ nfts }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [nfts.length === 0 ? (0, jsx_runtime_1.jsx)("p", { children: "No NFTs found." }) : null, nfts.map((nft) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: nft.name }), (0, jsx_runtime_1.jsx)("img", { src: nft.image, alt: nft.name, width: "200" }), (0, jsx_runtime_1.jsx)("p", { children: nft.description })] }, nft.tokenId)))] }));
};
exports.default = DisplayNFTs;

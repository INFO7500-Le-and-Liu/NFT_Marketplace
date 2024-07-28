// hardhat.config.js
require("@nomicfoundation/hardhat-ethers");
require("@typechain/hardhat");


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.0",

    typechain: {
        outDir: "typechain", // 生成的类型文件存储目录
        target: "ethers-v5", // 目标类型
    },
};

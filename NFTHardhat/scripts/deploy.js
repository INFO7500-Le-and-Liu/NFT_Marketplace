// deploy scripts
const { ethers } = require("hardhat");

async function main() {
    // get the contract
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

    // deploy
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment();

    console.log("NFTMarketplace deployed to:", await nftMarketplace.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

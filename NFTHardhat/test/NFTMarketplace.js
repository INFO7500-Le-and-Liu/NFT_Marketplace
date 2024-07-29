// const { expect } = require("chai");

const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
    let nftMarketplace;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // get zhe accounts
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // deploy 
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        nftMarketplace = await NFTMarketplace.deploy();
        await nftMarketplace.deploymentTransaction();
    });

    it("should mint an NFT correctly", async function () {
        const tokenURI = "https://ipfslink.com/nftexample";
        const price = ethers.utils.parseEther("1");

        // use add1 to run mintNFT
        await nftMarketplace.connect(addr1).mintNFT(tokenURI, price);

        // get tokenId
        const tokenId = await nftMarketplace.connect(addr1).callStatic.mintNFT(tokenURI, price);

        // get NFT
        const nft = await nftMarketplace.getNFT(tokenId);

        // test
        expect(nft.creator).to.equal(addr1.address);
        expect(nft.price).to.equal(price);
        expect(nft.isForSale).to.be.true;
        expect(await nftMarketplace.ownerOf(tokenId)).to.equal(addr1.address);
        expect(await nftMarketplace.tokenURI(tokenId)).to.equal(tokenURI);
    });
});

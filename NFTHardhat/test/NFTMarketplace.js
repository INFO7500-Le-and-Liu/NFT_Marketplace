import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("NFTMarketplace", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarketplace");
    const market: Contract = await Market.deploy();
    await market.deployed();
    const marketAddress: string = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft: Contract = await NFT.deploy();
    await nft.deployed();
    const nftContractAddress: string = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice });

    const signers: Signer[] = await ethers.getSigners();
    const buyerAddress: Signer = signers[1];

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    const items = await market.fetchMarketItems();
    expect(items.length).to.equal(1);
  });
});

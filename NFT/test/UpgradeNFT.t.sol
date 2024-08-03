// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/UpgradeNFT.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace public nftMarketplace;

    address public owner = address(0x123);
    address public buyer = address(0x456);

    function setUp() public {
        vm.startPrank(owner);
        nftMarketplace = new NFTMarketplace();
        nftMarketplace.initialize();
        vm.stopPrank();
    }

    function testMintNFT() public {
        vm.startPrank(owner);
        uint256 price = 1 ether;
        uint256 tokenId = nftMarketplace.mintNFT("tokenURI", price);

        NFTMarketplace.NFT memory nft = nftMarketplace.getNFT(tokenId);
        assertEq(nft.tokenId, tokenId);
        assertEq(nft.creator, owner);
        assertEq(nft.price, price);
        assertTrue(nft.isForSale);

        vm.stopPrank();
    }

    function testPurchaseNFT() public {
        vm.startPrank(owner);
        uint256 price = 1 ether;
        uint256 tokenId = nftMarketplace.mintNFT("tokenURI", price);
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
        console.log("Buyer balance before purchase:", buyer.balance);

        vm.startPrank(buyer);
        nftMarketplace.purchaseNFT{value: 1 ether}(tokenId);

        assertEq(nftMarketplace.ownerOf(tokenId), buyer);
        // NFTMarketplace.NFT memory nft = nftMarketplace.getNFT(tokenId);
        // assertFalse(nft.isForSale);

        vm.stopPrank();
    }

    function testListNFT() public {
        vm.startPrank(owner);
        uint256 price = 1 ether;
        uint256 tokenId = nftMarketplace.mintNFT("tokenURI", price);
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
        vm.startPrank(buyer);
        nftMarketplace.purchaseNFT{value: 1 ether}(tokenId);
        vm.stopPrank();

        vm.startPrank(buyer);
        nftMarketplace.listNFT(tokenId, 2 ether);

        NFTMarketplace.NFT memory nft = nftMarketplace.getNFT(tokenId);
        assertEq(nft.price, 2 ether);
        assertTrue(nft.isForSale);

        vm.stopPrank();
    }
}

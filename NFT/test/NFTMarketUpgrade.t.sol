// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace nftMarketplace;

    function setUp() public {
        nftMarketplace = new NFTMarketplace();
        nftMarketplace.initialize();
    }

    function testMintNFT() public {
        string memory tokenURI = "https://example.com/token/1";
        uint256 price = 1 ether;

        uint256 tokenId = nftMarketplace.mintNFT(tokenURI, price);
        (uint256 id, address creator, uint256 nftPrice, bool isForSale) = nftMarketplace.getNFT(tokenId);

        assertEq(id, tokenId);
        assertEq(creator, address(this));
        assertEq(nftPrice, price);
        assertTrue(isForSale);
    }

    function testPurchaseNFT() public {
        string memory tokenURI = "https://example.com/token/1";
        uint256 price = 1 ether;

        uint256 tokenId = nftMarketplace.mintNFT(tokenURI, price);
        address buyer = address(0x1);

        vm.prank(buyer);
        vm.deal(buyer, 1 ether);
        nftMarketplace.purchaseNFT{value: 1 ether}(tokenId);

        (uint256 id, address creator, uint256 nftPrice, bool isForSale) = nftMarketplace.getNFT(tokenId);

        assertEq(id, tokenId);
        assertEq(nftMarketplace.ownerOf(tokenId), buyer);
        assertFalse(isForSale);
    }

    function testListNFT() public {
        string memory tokenURI = "https://example.com/token/1";
        uint256 price = 1 ether;

        uint256 tokenId = nftMarketplace.mintNFT(tokenURI, price);
        nftMarketplace.listNFT(tokenId, 2 ether);

        (, , uint256 newPrice, bool isForSale) = nftMarketplace.getNFT(tokenId);

        assertEq(newPrice, 2 ether);
        assertTrue(isForSale);
    }
}

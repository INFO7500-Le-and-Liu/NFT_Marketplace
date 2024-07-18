// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace private nftMarketplace;
    address private owner;
    address private addr1;
    address private addr2;

    function setUp() public {
        owner = address(this);
        addr1 = address(0x123);
        addr2 = address(0x456);
        nftMarketplace = new NFTMarketplace();
    }

    function testMintNFT() public {
        string memory tokenURI = "https://ipfslink.com/nftexample";
        uint256 price = 1 ether;

        vm.prank(addr1);
        uint256 tokenId = nftMarketplace.mintNFT(tokenURI, price);
        NFTMarketplace.NFT memory nft = nftMarketplace.getNFT(tokenId);

        assertEq(nft.creator, addr1);
        assertEq(nft.price, price);
        assertTrue(nft.isForSale);
        assertEq(nftMarketplace.ownerOf(tokenId), addr1);
        assertEq(nftMarketplace.tokenURI(tokenId), tokenURI);
    }
}

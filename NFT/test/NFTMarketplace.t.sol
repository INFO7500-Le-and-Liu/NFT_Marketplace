// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/NFTMarketplace.sol";

contract NFTMarketplaceTest is Test {
    NFTMarketplace private nftMarketplace;
    address private addr1 = address(0x123);
    address private addr2 = address(0x456);
    string private constant tokenURI = "https://ipfslink.com/nftexample";

    function setUp() public {
        nftMarketplace = new NFTMarketplace();
    }

    function testMintNFT() public {
        // Simulate addr1 calling mintNFT
        vm.prank(addr1);
        uint256 tokenId = nftMarketplace.mintNFT(tokenURI, 1 ether);

        // Verify the returned tokenId is correct
        assertTrue(tokenId > 0);

        // Verify creator address, URI, and sale status
        NFTMarketplace.NFT memory nft = nftMarketplace.getNFT(tokenId);
        assertEq(nft.creator, addr1);
        assertEq(nft.price, 1 ether);
        assertTrue(nft.isForSale);
        assertEq(nftMarketplace.tokenURI(tokenId), tokenURI);
    }

    function testGetAllTokens() public {
        // Mint multiple NFTs
        vm.prank(addr1);
        uint256 tokenId1 = nftMarketplace.mintNFT(tokenURI, 1 ether);
        vm.prank(addr2);
        uint256 tokenId2 = nftMarketplace.mintNFT(tokenURI, 2 ether);

        // Retrieve all token IDs
        uint256[] memory tokens = nftMarketplace.getAllTokens();

        // Verify the correct number of tokens are returned
        assertEq(tokens.length, 2);

        // Verify the correct tokens are in the array
        assertEq(tokens[0], tokenId1);
        assertEq(tokens[1], tokenId2);
    }
}

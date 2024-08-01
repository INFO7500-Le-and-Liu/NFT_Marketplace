// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMintNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function getAllTokens() external view returns (uint256[] memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

contract NFTMarketplace is Ownable {
    struct NFT {
        uint256 tokenId;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFT) private _nfts;
    IMintNFT private _mintNFTContract;

    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);

    constructor(address mintNFTContractAddress) {
        _mintNFTContract = IMintNFT(mintNFTContractAddress);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(_mintNFTContract.ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(price > 0, "Price must be greater than zero");

        _nfts[tokenId] = NFT({
            tokenId: tokenId,
            price: price,
            isForSale: true
        });

        emit NFTListed(tokenId, price);
    }

    function unlistNFT(uint256 tokenId) public {
        require(_mintNFTContract.ownerOf(tokenId) == msg.sender, "Only the owner can unlist the NFT");

        _nfts[tokenId].isForSale = false;

        emit NFTUnlisted(tokenId);
    }

    function purchaseNFT(uint256 tokenId) public payable {
        NFT memory nft = _nfts[tokenId];
        require(nft.isForSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient funds to purchase NFT");

        address seller = _mintNFTContract.ownerOf(tokenId);

        // Transfer ownership of the NFT
        _mintNFTContract.safeTransferFrom(seller, msg.sender, tokenId);

        // Transfer the funds to the seller
        payable(seller).transfer(msg.value);

        // Update the NFT's sale status : always for sale
        _nfts[tokenId].isForSale = true;

        emit NFTPurchased(tokenId, msg.sender, nft.price);
    }
}

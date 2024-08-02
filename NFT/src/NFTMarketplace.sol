// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId = 0;  
    uint256[] private _allTokens; // Array to store all token IDs

    struct NFT {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFT) private _nfts;  // Mapping from token ID to NFT struct

    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 price);
    event NFTListed(uint256 indexed tokenId, uint256 price);
     event NFTPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);


    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {}

    // Function to mint a new NFT
    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _currentTokenId++;  // Increment the token ID counter
        uint256 newTokenId = _currentTokenId;

        _mint(msg.sender, newTokenId); // Mint the new token
        _setTokenURI(newTokenId, tokenURI); // Set the token URI

        _nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            creator: payable(msg.sender),
            price: price,
            isForSale: true
        });

        _allTokens.push(newTokenId);  // Store the new token ID in the array

        emit NFTMinted(newTokenId, msg.sender, tokenURI, price);

        return newTokenId;
    }

    // Function to get details of a specific NFT by token ID
    function getNFT(uint256 tokenId) public view returns (NFT memory) {
        // require(_exists(tokenId), "Query for nonexistent token");
        return _nfts[tokenId];
    }

    // Function to get all token IDs of minted NFTs
    function getAllTokens() public view returns (uint256[] memory) {
        return _allTokens;
    }

        // Function to purchase an NFT
    function purchaseNFT(uint256 tokenId) public payable {
        NFT memory nft = _nfts[tokenId];
        require(nft.isForSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient payment");

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        _nfts[tokenId].isForSale = true;

        emit NFTPurchased(tokenId, msg.sender, nft.price);
    }

}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counter.sol";

contract NFTMarketplace is ERC721URIStorage,Ownable {
    
    Counter private _tokenIds;  // Counter utility for token IDs
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

    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {
        _tokenIds = new Counter(0);  // Initialize the counter to 0
    }

    // Function to mint a new NFT
    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

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
}

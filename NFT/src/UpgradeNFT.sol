// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTMarketplace is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable {
    uint256 private _currentTokenId = 0;

    struct NFT {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFT) private _nfts;
    uint256[] private _allTokens;

    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 price);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);

    // init function
    function initialize() public initializer {
        __ERC721_init("NFTMarketplace", "NFTM");
        __Ownable_init(msg.sender);
    }
    

    // Function to mint a new NFT
    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _currentTokenId++;  // Increment the token ID counter
        uint256 newTokenId = _currentTokenId;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            creator: payable(msg.sender),
            price: price,
            isForSale: true
        });

        _allTokens.push(newTokenId);

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

        _nfts[tokenId].isForSale = true;///////

        emit NFTPurchased(tokenId, msg.sender, nft.price);
    }

    // Function to list an NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can list the NFT");
        require(price > 0, "Price must be greater than zero");

        _nfts[tokenId].price = price;
        _nfts[tokenId].isForSale = true;

        emit NFTListed(tokenId, price);
    }
}

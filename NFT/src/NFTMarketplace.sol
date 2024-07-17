// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFT {
        uint256 tokenId;
        address payable creator;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFT) private _nfts;

    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 price);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor() ERC721("NFTMarketplace", "NFTM") {}

    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            creator: payable(msg.sender),
            price: price,
            isForSale: true
        });

        emit NFTMinted(newTokenId, msg.sender, tokenURI, price);

        return newTokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(price > 0, "Price must be greater than zero");

        _nfts[tokenId].price = price;
        _nfts[tokenId].isForSale = true;

        emit NFTListed(tokenId, price);
    }

    function purchaseNFT(uint256 tokenId) public payable {
        NFT memory nft = _nfts[tokenId];
        require(nft.isForSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient funds");

        address payable creator = nft.creator;
        address owner = ownerOf(tokenId);

        _transfer(owner, msg.sender, tokenId);

        _nfts[tokenId].isForSale = false;

        creator.transfer(msg.value);

        emit NFTPurchased(tokenId, msg.sender, nft.price);
    }

    function getNFT(uint256 tokenId) public view returns (NFT memory) {
        return _nfts[tokenId];
    }
}

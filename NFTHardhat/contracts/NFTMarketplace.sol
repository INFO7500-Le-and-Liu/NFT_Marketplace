// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counter.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    
    Counter private _tokenIds;

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

    constructor() ERC721("NFTMarketplace", "NFTM") Ownable(msg.sender) {
        _tokenIds = new Counter(0); // init the Counter to 0
    }

    function mintNFT(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);//_mint() from ERC721
        _setTokenURI(newTokenId, tokenURI);//_setTokenURI() from ERC721

        _nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            creator: payable(msg.sender),
            price: price,
            isForSale: true
        });

        emit NFTMinted(newTokenId, msg.sender, tokenURI, price);

        return newTokenId;
    }

    function getNFT(uint256 tokenId) public view returns (NFT memory) {
        return _nfts[tokenId];
    }
}

// src/components/DisplayNFTs.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { signer } from '../Web3';

function DisplayNFTs({ contractAddress, contractABI }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    loadNFTs();
  });

  const loadNFTs = async () => {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tokenIds = await contract.getAllTokens();
    const nftData = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        return { tokenId, ...metadata };
      })
    );

    setNfts(nftData);
  };

  return (
    <div>
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <h3>{nft.name}</h3>
          <img src={nft.image} alt={nft.name} width="200" />
          <p>{nft.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DisplayNFTs;

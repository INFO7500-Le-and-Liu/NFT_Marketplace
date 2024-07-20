// src/components/DisplayNFTs.js
import React from 'react';

function DisplayNFTs({ nfts }) {
  return (
    <div>
      {nfts.length === 0 && <p>No NFTs found.</p>}
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

import React, { useState } from 'react';
import { ethers } from 'ethers';

import { purchaseNFT } from '../services/PurchaseNFT'; // 导入 purchaseNFT 函数

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// NFT metadata
interface NFTMetadata {
  name: string;
  price: string;
  description: string;
  cid: string;
  tokenID: {
    type: string;
    hex: string;
  };
}

const PurchaseNFTComponent: React.FC = () => {
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [tokenId, setTokenId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${IPFS_GATEWAY}${ipfsHash}`);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata from IPFS');
      }
      const data: NFTMetadata = await response.json();//////
      setMetadata(data);
      setTokenId(ethers.BigNumber.from(data.tokenID.hex).toString());
      setPrice(data.price);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      if (!tokenId || !price) {
        throw new Error('Token ID and price must be set');
      }
      setLoading(true);
      await purchaseNFT(tokenId, price);
      setLoading(false);
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      setLoading(false);
      alert('Purchase failed. Check console for details.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter IPFS Hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />
      <button onClick={fetchMetadata} disabled={loading}>
        {loading ? 'Loading...' : 'Load Metadata'}
      </button>

      {metadata && (
        <div>
          <h3>{metadata.name}</h3>
          <img
            src={`${IPFS_GATEWAY}${metadata.cid}`}
            alt={metadata.name}
            width="200"
            onError={(e) => e.currentTarget.src = '../../public/logo192.png'}
          />
          <p>{metadata.description}</p>
          <p>Price: {metadata.price} ETH</p>
          <p>Token ID: {tokenId}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handlePurchase} disabled={loading}>
        {loading ? 'Processing...' : 'Purchase NFT'}
      </button>
    </div>
  );
};

export default PurchaseNFTComponent;
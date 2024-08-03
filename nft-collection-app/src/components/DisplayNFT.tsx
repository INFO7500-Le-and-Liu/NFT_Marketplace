import React, { useEffect, useState } from 'react';

import './DisplayNFT.css';
import { ethers } from 'ethers';


interface NFT {
  name: string;
  price: string;
  description: string;
  image: string;
  cid: string;
  tokenID: string;
}


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

interface DisplayNFTsProps {}

const PINATA_API_URL = 'https://api.pinata.cloud/data/pinList?includeCount=true';
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

const DisplayNFTs: React.FC<DisplayNFTsProps> = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      const jwt = process.env.REACT_APP_PINATA_JWT_OUTSIDE;
      console.log('JWT Token:', jwt); // debug, need be removed

      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}` // inset into header
        }
      };

      try {
        const response = await fetch(PINATA_API_URL, options);
        const data = await response.json();
        console.log('API Response:', data);

        const files = data.rows;
        if (!files) {
          console.error('No files found in response');
          setLoading(false);
          return;
        }

        const cids = files.map((file: any) => file.ipfs_pin_hash);

        const fetchedNFTs = await Promise.all(
          cids.map(async (cid: string, index: number) => {
            try {
              const metadataResponse = await fetch(`${IPFS_GATEWAY}${cid}`);
              if (!metadataResponse.ok) {
                throw new Error('Failed to fetch metadata from IPFS');
              }
              const metadata: NFTMetadata = await metadataResponse.json();
              console.log("Data", index);
              console.log("metadata", metadata);

              return {
                name: metadata.name,
                price: metadata.price,
                description: metadata.description,
                image: `${IPFS_GATEWAY}${metadata.cid}`,
                cid: metadata.cid,
                tokenID: ethers.BigNumber.from(metadata.tokenID.hex).toString(),
              };
            } catch (err) {
              console.error('Error fetching metadata for CID:', cid, err);
              return null;
            }
          })
        );

        setNfts(fetchedNFTs.filter(nft => nft !== null) as NFT[]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pinata data:', err);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) {
    return <p>Loading NFTs...</p>;
  }

  return (
    <div>
      {nfts.length === 0 ? <p>No NFTs found.</p> : null}
      {nfts.map((nft) => (
        <div key={nft.tokenID}>
          <h3>{nft.name}</h3>
          <img
            src={nft.image}
            alt={nft.name}
            width="200"
            onError={(e) => e.currentTarget.src = '../../public/logo192.png'}
          />
          <p>{nft.description}</p>
          <p>Price: {nft.price} ETH</p>
          <p>Token ID: {nft.tokenID}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayNFTs;

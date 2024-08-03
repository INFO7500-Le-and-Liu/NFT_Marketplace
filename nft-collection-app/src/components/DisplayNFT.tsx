import React, { useEffect, useState } from 'react';
import './DisplayNFT.css';

// NFT type
interface NFT {
  tokenId: string;
  // name: string;
  image: string;//url
  // description: string;
}

interface DisplayNFTsProps {}

// pinata gateway
const PINATA_API_URL = 'https://api.pinata.cloud/data/pinList?includeCount=true';
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

const DisplayNFTs: React.FC<DisplayNFTsProps> = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      const jwt = process.env.REACT_APP_PINATA_JWT;
      console.log('JWT Token:', jwt); // debug, need be removed
    
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`  // inset into header
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
              // const metadataResponse = await fetch(`${IPFS_GATEWAY}${cid}`); //?
              // const metadata = await metadataResponse.json();

              return {
                tokenId: cid,
                // name: metadata.name || `NFT ${index + 1}`,
                image: `${IPFS_GATEWAY}${cid}`,
                // description: metadata.description || 'No description available'
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
    return <p>Loading NFTs...</p >;
  }

  return (
    <div>
      {nfts.length === 0 ? <p>No NFTs found.</p > : null}
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          {/* <h3>{nft.name}</h3> */}
          {/* < img src={nft.image} alt={nft.name} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} /> */}
          < img src={nft.image} alt={'123'} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} />

          {/* <p>{nft.description}</p > */}
        </div>
      ))}
    </div>
  );
};

export default DisplayNFTs;
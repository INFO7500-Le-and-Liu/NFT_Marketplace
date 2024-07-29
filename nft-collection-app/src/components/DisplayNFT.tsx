import React, { useEffect, useState } from 'react';

// NFT type
interface NFT {
  tokenId: string;
  // name: string;
  image: string;
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
      const jwt = process.env.PINATA_JWT;
      console.log('JWT Token:', jwt); // debug, need be removed
    
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMTUxNzIxOS1iZGE1LTRhNjEtOWE3Yi05YTgyZWQ0ZDBiNmYiLCJlbWFpbCI6ImxpdS5kb25neXVAbm9ydGhlYXN0ZXJuLmVkdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMGRhYmE4NjZiNTc4MWM4MjFmOCIsInNjb3BlZEtleVNlY3JldCI6IjFhNThmZDdhMDJjM2JlZjYwZTI2YmNiY2Y5OGRjNjczMTYwMTk3NzdiY2YwYmU5ZjliZWM1ZTJhMDQyMGMzMjkiLCJleHAiOjE3NTM3NzYzNjd9.0mlgz9N61CjUxf2EtYiuZUNDDfz4H-DDtYz7o8DL1UA`  // inset into header
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
              // const metadataResponse = await fetch(`${IPFS_GATEWAY}${cid}`); // later job
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
    return <p>Loading NFTs...</p>;
  }

  return (
    <div>
      {nfts.length === 0 ? <p>No NFTs found.</p> : null}
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          {/* <h3>{nft.name}</h3> */}
          {/* <img src={nft.image} alt={nft.name} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} /> */}
          <img src={nft.image} alt={'123'} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} />

          {/* <p>{nft.description}</p> */}
        </div>
      ))}
    </div>
  );
};

export default DisplayNFTs;

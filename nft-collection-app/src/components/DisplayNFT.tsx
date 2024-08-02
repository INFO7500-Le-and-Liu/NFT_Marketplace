import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// NFT type
interface NFT {
  tokenID: string;
  name: string;
  price: string;
  image: string;
  description: string;
  cid: string;
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

      const jwto = process.env.REACT_APP_PINATA_JWT_OUTSIDE;
      console.log('JWT Token:', jwto); // debug, need be removed

      const optionso = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwto}`  // inset into header
        }
      };


      const jwt = process.env.REACT_APP_PINATA_JWT;
      console.log('JWT Token:', jwt); // debug, need be removed
    
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`  // inset into header
        }
      };

      try {
        const responseo = await fetch(PINATA_API_URL, optionso)
        const datao = await responseo.json();
        console.log('API Response:', datao);

        const fileso = datao.rows;
        if (!fileso) {
          console.error('No files found in response');
          setLoading(false);
          return;
        }
        const cidso = fileso.map((file: any) => file.ipfs_pin_hash);
        const fetchedNFTso = await Promise.all(
          cidso.map(async (cido: string, index: number) => {
            try {
              // const metadataResponseo = await fetch(`${IPFS_GATEWAY}${cido}`); // later job
              // const metadatao = await metadataResponseo.json();

              return {
                tokenId: cido,
                // name: metadata.name || `NFT ${index + 1}`,
                image: `${IPFS_GATEWAY}${cido}`,
                // description: metadata.description || 'No description available'
              };
            } catch (err) {
              console.error('Error fetching metadata for CIDO:', cido, err);
              return null;
            }
          })
        );


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
              const metadataResponse = await fetch(`${IPFS_GATEWAY}${cid}`); // later job
              const metadata = await metadataResponse.json();

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


        // setNfts(fetchedNFTs.filter(nft => nft !== null) as NFT[]);
        setNfts(fetchedNFTso.filter(nft => nft !== null) as NFT[]);
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
        <div key={nft.tokenID}>
          {/* <h3>{nft.name}</h3> */}
          {/* < img src={nft.image} alt={nft.name} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} /> */}
          <Link
            to={{
              pathname: `/buy/${nft.tokenID}`,
              state: {
                name: nft.name,
                price: nft.price,
                description: nft.description,
                image: nft.image,
              }
            }}
          >

            <img src={nft.image} alt={'123'} width="200" onError={(e) => e.currentTarget.src = '../../public/logo192.png'} />
          </Link>

          {/* <p>{nft.description}</p > */}
        </div>
      ))}
    </div>
  );
};

export default DisplayNFTs;
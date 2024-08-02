// // src/pages/Buy.tsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { NFT } from '../type';

// const Buy: React.FC = () => {
//   const { tokenId } = useParams<{ tokenId: string }>();
//   const [nft, setNft] = useState<NFT | null>(null);

//   useEffect(() => {
//     const loadNFT = async () => {
//       try {
//         if (tokenId) {
//           const nftData = await fetchNFTDetails(tokenId);
//           setNft(nftData);
//         }
//       } catch (err) {
//         console.error('Error fetching NFT details:', err);
//       }
//     };

//     loadNFT();
//   }, [tokenId]);

//   if (!nft) return <div>Loading...</div>;

//   return (
//     <div className="buy">
//       <h1>Buy NFT</h1>
//       <div className="nft-details">
//         <img src={`https://ipfs.io/ipfs/${nft.cid}`} alt={nft.name} />
//         <h2>{nft.name}</h2>
//         <p>Price: {nft.price} ETH</p>
//         <p>Quantity: {nft.quantity}</p>
//         {/* Add any additional details or purchase logic here */}
//       </div>
//     </div>
//   );
// };

// export default Buy;

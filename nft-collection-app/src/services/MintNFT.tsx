// MintNFT.tsx
// import React from 'react';
import { ethers } from 'ethers';

import nftCollection from '../abi/contract.json'; // ABI file
import {web3Service} from './Web3';

const contractAddress: string = '0x1F0B7cbAa20bA250961905d03c940277491025e5'; // contract address
const contractABI: ethers.ContractInterface = nftCollection.abi; // ABI

// export the function
export async function mintNFT(cid: any, price: string) {
  try {
    // make sure not null
    if (!web3Service.signer) {
      throw new Error("No signer available. Please connect to a wallet.");
    }
    const signer = web3Service.signer;

    const tokenURI = `https://gateway.pinata.cloud/ipfs/${cid}`

    // creat contract init
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    const transaction = await contract.mintNFT(tokenURI, ethers.utils.parseEther(price));
    const receipt = await transaction.wait();

    //return transcation hash
    console.log("transaction:", transaction);
    console.log("Transaction Hash:", transaction.hash);

    const event = receipt.events?.find((event: { event: string; }) => event.event === "NFTMinted");
    const tokenId = event?.args?.tokenId;

    console.log(`Minted NFT with token ID: ${tokenId}`);
    
    return tokenId; 
  } catch (error) {
      console.error("Error in mintNFT function:", error);
      throw error; 
  }
}


// interface MintNFTProps {
//   cid: string;
//   price: string;
// }

// const MintNFT: React.FC<MintNFTProps> = ({ cid, price }) => {
//   const mintNFT = async () => {
//     try {
//       // make sure not null
//       if (!web3Service.signer) {
//         throw new Error("No signer available. Please connect to a wallet.");
//       }
//       const signer = web3Service.signer;

//       // creat contract init
//       const contract = new ethers.Contract(contractAddress, contractABI, signer);

//       // use the Mint function
//       const transaction = await contract.mintNFT(cid, ethers.utils.parseEther(price));
//       await transaction.wait();
      
//       console.log("NFT Minted: ", transaction);
//     } catch (error) {
//       console.error("Error minting NFT:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={mintNFT}>Mint NFT</button>
//     </div>
//   );
// };

// export default MintNFT;


// src/App.tsx
import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { signer } from './Web3';
// import ConnectWallet from './components/Wallet';
// import MintNFT from './components/MintNFT';
import WalletConnection from './components/ConnectWallet';
import DisplayNFTs from './components/DisplayNFT';
import { NFT } from './type';
import UploadComponent from './components/UploadComponent'; 
import PurchaseNFTComponent from './components/PurchaseComponent'
// import dotenv from 'dotenv';

// dotenv.config();

function App() {
  const [nfts, setNfts] = useState<NFT[]>([]);

  return (
    <div className="App">
      <WalletConnection />
      <UploadComponent />
      <DisplayNFTs />
      <PurchaseNFTComponent /> 
    </div>
  );
  }
  
export default App;


  // const loadNFTs = async () => {
  //   try {
  //     const contract = new ethers.Contract(contractAddress, contractABI, signer);
  //     const tokenIds: number[] = await contract.getAllTokens();
  //     const nftData: NFT[] = await Promise.all(
  //       tokenIds.map(async (tokenId: number) => {
  //         const tokenURI: string = await contract.tokenURI(tokenId);
  //         const response = await fetch(tokenURI);
  //         const metadata: any = await response.json();
  //         return { tokenId, ...metadata };
  //       })
  //     );
  //     setNfts(nftData);
  //   } catch (err) {
  //     console.error('Error loading NFTs:', err);
  //   }
  // };

  // useEffect(() => {
  //   loadNFTs();
  // }, []);

// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { signer } from './Web3';
import ConnectWallet from './components/Wallet';
// import MintNFT from './components/MintNFT';
import DisplayNFTs from './components/DisplayNFT';
import { NFT } from './type';

import nftCollection from './abi/contract.json'; // 导入 ABI

const contractAddress: string = '0x1F0B7cbAa20bA250961905d03c940277491025e5'; // 合约地址
const contractABI: ethers.ContractInterface = nftCollection.abi; // ABI

function App() {
  const [nfts, setNfts] = useState<NFT[]>([]);

  const loadNFTs = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tokenIds: number[] = await contract.getAllTokens();
      const nftData: NFT[] = await Promise.all(
        tokenIds.map(async (tokenId: number) => {
          const tokenURI: string = await contract.tokenURI(tokenId);
          const response = await fetch(tokenURI);
          const metadata: any = await response.json();
          return { tokenId, ...metadata };
        })
      );
      setNfts(nftData);
    } catch (err) {
      console.error('Error loading NFTs:', err);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  return (
    <div className="App">
      <ConnectWallet />
      {/* <MintNFT contractAddress={contractAddress} contractABI={contractABI} loadNFTs={loadNFTs} /> */}
      <h1>NFT Gallery</h1>
      <DisplayNFTs/>
    </div>
  );
}

export default App;

// src/App.js
import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { signer } from './Web3';
import ConnectWallet from './components/Wallet';
import MintNFT from './components/MintNFT';
import DisplayNFTs from './components/DisplayNFT';

import nftCollection from './abi/contract.json';  // import abi
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // contract address
const contractABI = nftCollection.abi; // ABI

function App() {
  const [nfts, setNfts] = useState([]);

  const loadNFTs = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tokenIds = await contract.getAllTokens();
      const nftData = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          return { tokenId, ...metadata };
        })
      );
      setNfts(nftData);
    } catch (err) {
      console.error('Error loading NFTs:', err);
    }
  };

  // run when loading
  useEffect(() => {
    loadNFTs();
  }, []);

  return (
    <div className="App">
      <ConnectWallet />
      <MintNFT contractAddress={contractAddress} contractABI={contractABI} loadNFTs={loadNFTs} />
      <DisplayNFTs nfts={nfts} />
    </div>
  );
}
export default App;

// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DisplayNFTs from '../components/DisplayNFT';
import { NFT } from '../type';
import UploadComponent from '../components/UploadComponent';
import WalletConnection from '../components/ConnectWallet';
import nftCollection from '../abi/contract.json';

const contractAddress: string = '0x1F0B7cbAa20bA250961905d03c940277491025e5';
const contractABI: ethers.ContractInterface = nftCollection.abi;

const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);


  return (
    <div className="Home">
      <WalletConnection />
      <UploadComponent />
      {/* <MintNFT contractAddress={contractAddress} contractABI={contractABI}/> */}
      <DisplayNFTs />
    </div>
  );
};

export default Home;

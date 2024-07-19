// src/App.js
import React from 'react';
import ConnectWallet from './components/Wallet';
import MintNFT from './components/MintNFT';
import DisplayNFTs from './components/DisplayNFT';

const contractAddress = '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707'; // contract address
const contractABI = [ ]; // ABI

function App() {
  return (
    <div className="App">
      <ConnectWallet />
      <MintNFT contractAddress={contractAddress} contractABI={contractABI} />
      <DisplayNFTs contractAddress={contractAddress} contractABI={contractABI} />
    </div>
  );
}

export default App;

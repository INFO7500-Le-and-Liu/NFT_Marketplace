// src/services/ConnectWallet.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedAccount(accounts[0]);

        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);

        const newSigner = newProvider.getSigner();
        setSigner(newSigner);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setConnectedAccount(null);
    setProvider(null);
    setSigner(null);
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);

          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);

          const newSigner = newProvider.getSigner();
          setSigner(newSigner);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      {connectedAccount ? (
        <div>
          <button onClick={disconnectWallet}>Disconnect</button>
          <p>Connected with <strong>{connectedAccount}</strong></p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;

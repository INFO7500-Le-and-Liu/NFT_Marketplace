import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnection: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // check
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setProvider(web3Provider);
            setSigner(web3Provider.getSigner());
            setAccount(accounts[0]);
            setIsConnected(true);
          }
          console.log("signer:", signer);
          console.log("provider:", provider);
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
        await web3Provider.send("eth_requestAccounts", []);
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setProvider(web3Provider);
          setSigner(web3Provider.getSigner());
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected with account: {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnection;

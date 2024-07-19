// src/components/Wallet.js
import React, { useState } from 'react';
import { signer } from '../Web3';

function ConnectWallet() {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const connectWallet = () => {
    const account = signer.address;
    setConnectedAccount(account);
  };

  return (
    <div>
      {connectedAccount ? (
        <div>
          <button onClick={() => setConnectedAccount(null)}>Disconnect</button>
          <p>Connected with <strong>{connectedAccount}</strong></p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect to Default Account</button>
      )}
    </div>
  );
}

export default ConnectWallet;

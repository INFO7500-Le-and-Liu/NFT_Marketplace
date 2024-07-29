declare module 'Web3' {
    import { ethers } from 'ethers';
  
    const provider: ethers.providers.JsonRpcProvider;
    const signer: ethers.Wallet;
  
    export { provider, signer };
  }
  
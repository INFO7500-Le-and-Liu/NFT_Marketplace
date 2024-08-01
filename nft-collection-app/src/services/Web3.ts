// src/services/web3Service.ts
import { ethers } from 'ethers';
 
class Web3Service {
  provider: ethers.providers.Web3Provider | null = null;
  signer: ethers.Signer | null = null;
 
  constructor() {
    this.init();
  }
 
  async init() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        const accounts = await this.provider.listAccounts();
        if (accounts.length > 0) {
          this.signer = this.provider.getSigner();
        }
      } catch (error) {
        console.error("Error initializing Web3 provider:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  }
 
  async connectWallet() {
    if (this.provider) {
      try {
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  }
}
 
export const web3Service = new Web3Service();
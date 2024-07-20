import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any');
      (window as any).ethereum.request({ method: 'eth_requestAccounts' }).catch((error: any) => {
        console.error('用户拒绝了授权请求:', error);
      });
    } else {
      console.error('MetaMask 未安装');
    }
  }

  async getAccounts(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('Provider 未初始化');
    }
    const signer = this.provider.getSigner();
    return signer.getAddress();
  }

  async getNetwork(): Promise<ethers.providers.Network> {
    if (!this.provider) {
      throw new Error('Provider 未初始化');
    }
    return this.provider.getNetwork();
  }

  async sendTransaction(to: string, value: string): Promise<ethers.providers.TransactionResponse> {
    if (!this.provider) {
      throw new Error('Provider 未初始化');
    }
    const signer = this.provider.getSigner();
    const tx = {
      to,
      value: ethers.utils.parseEther(value)
    };
    return signer.sendTransaction(tx);
  }
}

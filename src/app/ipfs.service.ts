import { Injectable } from '@angular/core';
import { create } from 'ipfs-http-client';  // 确保使用正确的导入方式

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private ipfs: any;

  constructor() {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const result = await this.ipfs.add(file);
      return result.path;
    } catch (error) {
      console.error('Error uploading file to IPFS', error);
      throw error;
    }
  }
}

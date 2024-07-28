import { Component } from '@angular/core';
import { IpfsService } from '../ipfs.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-nft-collection',
  templateUrl: './nft-collection.component.html',
  styleUrls: ['./nft-collection.component.css']
})
export class NftCollectionComponent {
  fileUrl: string = '';
  files: any[] = [];

  constructor(private ipfsService: IpfsService,private walletService: WalletService) {}

  connectWallet() {
    this.walletService.connectWallet();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    try {
      const path = await this.ipfsService.uploadFile(file);
      this.fileUrl = `https://ipfs.infura.io/ipfs/${path}`;
      this.files.push({ name: file.name, url: this.fileUrl });
    } catch (error) {
      console.error('Error uploading file', error);
    }
  }
}

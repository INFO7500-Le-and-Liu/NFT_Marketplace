import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NftCollectionComponent } from './nft-collection/nft-collection.component';
import { IpfsService } from './ipfs.service';

@NgModule({
  declarations: [
    AppComponent,
    NftCollectionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [IpfsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

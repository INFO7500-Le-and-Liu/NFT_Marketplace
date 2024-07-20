import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftCollectionComponent } from './nft-collection.component';

describe('NftCollectionComponent', () => {
  let component: NftCollectionComponent;
  let fixture: ComponentFixture<NftCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NftCollectionComponent]
    });
    fixture = TestBed.createComponent(NftCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

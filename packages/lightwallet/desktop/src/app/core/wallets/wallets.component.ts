import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '@merit/common/services/wallet.service';
import { RefreshWalletsAction, WalletsState } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { getWallets } from '@merit/common/reducers';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class WalletsComponent implements OnInit {
  constructor(private walletService: WalletService,
              private store: Store<WalletsState>) {
  }

  ngOnInit() {
    console.log('On init called');
    this.store.dispatch(new RefreshWalletsAction());

    console.log('Wallets are ', this.store.select(getWallets));
  }
}

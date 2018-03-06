import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '@merit/common/services/wallet.service';
import { RefreshWalletsAction, WalletsState } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { getWalletsLoading, getWallets, IAppState } from '@merit/common/reducers';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.view.html',
  styleUrls: ['./wallets.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class WalletsViewComponent implements OnInit {
  wallets$: Observable<DisplayWallet[]>;
  walletsLoading$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
    this.store.dispatch(new RefreshWalletsAction());
  }

  ngOnInit() {
    this.store.dispatch(new RefreshWalletsAction());
    // this.wallets$ = this.store.select(getWallets);
    // this.walletsLoading$ = this.store.select(getWalletsLoading);
  }
}

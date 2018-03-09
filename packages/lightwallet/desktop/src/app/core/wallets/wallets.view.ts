import { Component, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { getWallets, getWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.view.html',
  styleUrls: ['./wallets.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class WalletsViewComponent {
  wallets$: Observable<DisplayWallet[]> = this.store.select(getWallets);
  walletsLoading$: Observable<boolean> = this.store.select(getWalletsLoading);

  constructor(private store: Store<IRootAppState>) {
  }
}

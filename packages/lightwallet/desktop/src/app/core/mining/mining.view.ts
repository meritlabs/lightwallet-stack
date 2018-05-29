import { Component, ViewEncapsulation} from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  selectWallets, selectWalletsLoading,
} from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';

@Component({
  selector: 'view-mining',
  templateUrl: './mining.view.html',
  styleUrls: ['./mining.view.sass'],
  encapsulation: ViewEncapsulation.None
})

export class MiningView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  selectedWallet: DisplayWallet;

  address: string;
  alias: string;

  constructor(private store: Store<IRootAppState>) {
  }

  async ngOnInit() {
    try {
      const wallets = await this.wallets$.pipe(
            filter(w => w.length > 0), take(1)).toPromise();

      this.selectedWallet = wallets[0];
      this.address = this.selectedWallet.client.getRootAddress().toString();
      let info = await this.addressService.getAddressInfo(this.address);
      this.alias = info.alias;
      this.formatAddress();
    } catch (err) {
      if (err.text)
        console.log('Could not initialize: ', err.text);
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
  }
}

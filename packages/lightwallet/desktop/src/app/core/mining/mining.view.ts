import { Component, ViewEncapsulation} from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  selectWallets, selectWalletsLoading,
} from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';
import { filter, take } from 'rxjs/operators';

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

  constructor(
    private store: Store<IRootAppState>,
    private walletService: WalletService,
    private addressService: AddressService) {
  }

  async ngOnInit() {
    try {
      const wallets = await this.wallets$.pipe(
            filter(w => w.length > 0), take(1)).toPromise();

      this.selectWallet(wallets[0]);
    } catch (err) {
      if (err.text)
        console.log('Could not initialize: ', err.text);
    }
  }

  async selectWallet(wallet: DisplayWallet) {
    if (!wallet) return;

    this.selectedWallet = wallet;
    this.address = this.selectedWallet.client.getRootAddress().toString();
    let info = await this.addressService.getAddressInfo(this.address);
    this.alias = info.alias;
  }

}

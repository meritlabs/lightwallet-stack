import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../lib/merit-wallet-client';
import { sortBy } from 'lodash';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {

  transactions: any[];

  constructor(private walletService: WalletService,
              private profileService: ProfileService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async refresh(refresher: any) {
    try {
      await this.loadData();
    } catch (e) {}

    refresher.complete();
  }

  async loadData() {
    const wallets = await this.profileService.getWallets();
    const transactions = await Promise.all(wallets.map((wallet: MeritWalletClient) =>
      this.walletService.getTxHistory(wallet)
    ));

    // TODO sort by transaction date
    this.transactions = sortBy(Array.prototype.concat.apply([], transactions), '');

    console.log('Transactions are ', this.transactions);
  }

}

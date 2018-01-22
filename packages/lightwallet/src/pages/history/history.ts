import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../lib/merit-wallet-client';
import { sortBy } from 'lodash';
import { formatWalletHistory } from '../../utils/transactions';

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
      await this.loadData(true);
    } catch (e) {}

    refresher.complete();
  }

  async loadData(force?: boolean) {
    const wallets = await this.profileService.getWallets();
    let walletHistories = await Promise.all(wallets.map(async (wallet: MeritWalletClient) => {
      const walletHistory = await this.walletService.getTxHistory(wallet, { force });
      return formatWalletHistory(walletHistory, wallet);
    }));

    this.transactions = sortBy(Array.prototype.concat.apply([], walletHistories), 'time').reverse();

    console.log('Transactions are ', this.transactions);
  }

}

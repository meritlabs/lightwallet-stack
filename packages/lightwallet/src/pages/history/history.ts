import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../lib/merit-wallet-client';
import { formatWalletHistory } from '../../utils/transactions';
import { createDisplayWallet, IDisplayWallet } from '../../models/display-wallet';
import { SendService } from 'merit/transact/send/send.service';
import { sortBy, flatten } from 'lodash';
import { ContactsProvider } from '../../providers/contacts/contacts';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {
  transactions: any[];

  constructor(private walletService: WalletService,
              private profileService: ProfileService,
              private sendService: SendService,
              private contactsService: ContactsProvider) {
  }

  async ngOnInit() {
    await this.loadData();
  }

  async refresh(refresher: any) {
    try {
      await this.loadData(true);
    } catch (e) {
    }

    refresher.complete();
  }

  async loadData(force?: boolean) {
    const wallets = await this.profileService.getWallets();
    const walletHistories = await Promise.all(wallets.map(async (wallet: MeritWalletClient) => {
      const walletHistory = await this.walletService.getTxHistory(wallet, { force });
      const displayWallet: IDisplayWallet = await createDisplayWallet(wallet, this.walletService, this.sendService, { hideAnv: true, hideInvites: true, hideRewards: true});
      return formatWalletHistory(walletHistory, displayWallet, this.contactsService);
    }));

    this.transactions = sortBy(flatten(walletHistories), 'time').reverse();
  }
}

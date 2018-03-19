import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { flatten, sortBy } from 'lodash';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { formatWalletHistory } from '@merit/common/utils/transactions';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {
  transactions: any[];

  constructor(private walletService: WalletService,
              private profileService: ProfileService,
              private addressService: AddressService,
              private contactsService: ContactsService) {
  }

  ionViewWillEnter() {
    return this.loadData();
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
      const displayWallet: DisplayWallet = await createDisplayWallet(wallet, this.walletService, this.addressService, null, {
        skipAnv: true,
        skipStatus: true,
        skipRewards: true
      });
      return formatWalletHistory(walletHistory, displayWallet, this.contactsService);
    }));
    this.transactions = sortBy(flatten(walletHistories), 'time').reverse();
  }
}

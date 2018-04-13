import { Component } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';
import { flatten, sortBy } from 'lodash';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { PersistenceService2 } from '../../../../common/services/persistence2.service';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {
  transactions: any[];
  loading: boolean;
  refreshing: boolean;

  constructor(private walletService: WalletService,
              private profileService: ProfileService,
              private addressService: AddressService,
              private contactsService: ContactsService,
              private events: Events,
              private persistenceService: PersistenceService2
  ) {
  }

  async ionViewDidLoad() {
    this.loading = true;
    await this.loadData();
    this.loading = false;
  }

  async ionViewWillEnter() {
    this.refreashData();
  }

  async doRefresh(refresher: any) {
    await this.refreashData();
    refresher.complete();
  }

  private async refreashData() {
    this.refreshing = true;
    await this.loadData();
    this.refreshing = false;
  }

  async loadData(force?: boolean) {
    const wallets = await this.profileService.getWallets();
    const walletHistories = await Promise.all(wallets.map(async (wallet: MeritWalletClient) => {
      const walletHistory = await this.walletService.getTxHistory(wallet, { force });
      return formatWalletHistory(walletHistory, wallet, await this.persistenceService.getEasySends(), this.contactsService);
    }));
    this.transactions = sortBy(flatten(walletHistories), 'time').reverse();
  }
}

import { Component } from '@angular/core';
import { IonicPage, Events, ModalController } from 'ionic-angular';
import { flatten, sortBy } from 'lodash';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { PersistenceService2 } from '../../../../common/services/persistence2.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {
  transactions:  Array<any> = [];
  txs: Array<any> = [];

  loading: boolean;
  refreshing: boolean;
  wallets: Array<MeritWalletClient>;
  wallet: MeritWalletClient;

  offset: number = 0;
  limit: number = 10;

  constructor(private walletService: WalletService,
              private profileService: ProfileService,
              private addressService: AddressService,
              private contactsService: ContactsService,
              private events: Events,
              private persistenceService: PersistenceService2,
              private modalCtrl: ModalController
  ) {
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.wallets = await this.profileService.getWallets();
    if (this.wallets.length) this.wallet = this.wallets[0];
    await this.loadHistory();
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
    this.wallets = await this.profileService.getWallets();
    await this.loadHistory();
    this.refreshing = false;
  }

  async loadHistory() {
    if (!this.wallet) return;
    this.txs = await this.wallet.getTxHistory({ skip: 0, limit: this.limit, includeExtendedInfo: true });
    await this.formatHistory();
  }

  async loadMoreHistory(infiniter) {

    this.offset += this.limit;
    try {
      const txs = await this.wallet.getTxHistory({ skip: this.offset, limit: this.limit, includeExtendedInfo: true });
      this.txs = this.txs.concat(txs);
      await this.formatHistory();
    } catch (e) {
      console.log(e);
    }
    infiniter.complete();
  }

  private async formatHistory() {
    this.transactions = await formatWalletHistory(this.txs, this.wallet, await this.persistenceService.getEasySends(), this.contactsService);
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = wallet;
      }
    });
    return modal.present();
  }

}

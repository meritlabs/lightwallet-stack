import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../lib/merit-wallet-client';
import { sortBy } from 'lodash';
import { formatWalletHistory } from '../../utils/transactions';
import { createDisplayWallet } from '../../models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {

  transactions: any[];

  constructor(
    private walletService: WalletService,
    private profileService: ProfileService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.loadData();
    //todo temp!!
    //let unlockRequest = {timestamp: (new Date()).getTime(), address: 'mTU55fvNoHc4ewK6Rucb3Wnccihr499uGJ', alias: 'mywallet'};
    //this.processUnlockRequest(unlockRequest);s
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
      return formatWalletHistory(walletHistory, await createDisplayWallet(wallet, this.walletService));
    }));

    this.transactions = sortBy(Array.prototype.concat.apply([], walletHistories), 'time').reverse();

    console.log('Transactions are ', this.transactions);

  }

  public processUnlockRequest(unlockRequest) {
    let modal = this.modalCtrl.create('IncomingRequestModal', {unlockRequest});
    modal.present();
  }

}

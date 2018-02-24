import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { formatWalletHistory } from '../../../utils/transactions';
import { IDisplayWallet } from '../../../models/display-wallet';
import { SendService } from 'merit/transact/send/send.service';

@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'wallet-details-view',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {

  wallet: MeritWalletClient;
  displayWallet: IDisplayWallet;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public walletService: WalletService,
              private logger: Logger,
              private tabsCtrl: Tabs
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.displayWallet = this.navParams.get('wallet');
    this.wallet = this.displayWallet.client;
    await this.getWalletHistory();
  }

  async deposit() {
    this.navCtrl.popToRoot();
    try {
      const nav: Tab = this.tabsCtrl._tabs[1];
      await nav.setRoot('ReceiveView', { wallet: this.displayWallet.client });
      await nav.popToRoot();
      await this.tabsCtrl.select(1);
    } catch (e) {
      console.log(e);
    }
  }

  async send() {
    this.navCtrl.popToRoot();
    try {
      await this.tabsCtrl.select(3);
      await this.tabsCtrl.getActiveChildNavs()[0].popToRoot();
    } catch (e) {
      console.log(e);
    }
  }


  private async getWalletHistory(force: boolean = false) {
    try {
      const txs = await this.walletService.getTxHistory(this.wallet, { force });
      this.wallet.completeHistory = await formatWalletHistory(txs, this.displayWallet);
    } catch (err) {
      this.logger.info(err);
    }
  }
}

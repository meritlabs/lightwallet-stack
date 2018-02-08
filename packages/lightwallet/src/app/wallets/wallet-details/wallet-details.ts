import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { formatWalletHistory } from '../../../utils/transactions';
import { createDisplayWallet, IDisplayWallet } from '../../../models/display-wallet';

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
              private tabsCtrl: Tabs) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.wallet = this.navParams.get('wallet');
    this.displayWallet = await createDisplayWallet(this.wallet, this.walletService);
    await this.getWalletHistory();
  }

  async deposit() {
    this.navCtrl.popToRoot();
    try {
      await this.tabsCtrl.select(1);
      await this.tabsCtrl.getActiveChildNavs()[0].popToRoot();
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

  goToEditWallet() {
    this.navCtrl.push('EditWalletView', { wallet: this.wallet });
  }

  // Belt and suspenders check to be sure that the total number of TXs on the page

  private async getWalletHistory(force: boolean = false) {
    try {
      const txs = await this.walletService.getTxHistory(this.wallet, { force });
      this.wallet.completeHistory = formatWalletHistory(txs, this.displayWallet);
    } catch (err) {
      this.logger.info(err);
    }
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
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

    console.log('WALLET IS ', this.wallet);
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


  // Belt and suspenders check to be sure that the total number of TXs on the page

  private async getWalletHistory(force: boolean = false) {
    try {
      const txs = await this.walletService.getTxHistory(this.wallet, { force });
      this.wallet.completeHistory = await formatWalletHistory(txs, this.displayWallet);
    } catch (err) {
      this.logger.info(err);
    }
  }
}

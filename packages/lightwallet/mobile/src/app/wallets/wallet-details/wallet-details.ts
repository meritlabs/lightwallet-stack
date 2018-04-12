import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs, Events } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';

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

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private logger: LoggerService,
              private tabsCtrl: Tabs,
              private events: Events
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.wallet = this.navParams.get('wallet');
    await this.getWalletHistory();

    this.events.subscribe('Remote:IncomingTx', () => {
      this.wallet.getStatus();
      this.getWalletHistory();
    });
  }

  async deposit() {
    this.navCtrl.popToRoot();
    try {
      const nav: Tab = this.tabsCtrl._tabs[1];
      await nav.setRoot('ReceiveView', { wallet: this.wallet });
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
      this.wallet.completeHistory = await formatWalletHistory(txs, this.wallet);
    } catch (err) {
      this.logger.info(err);
    }
  }
}

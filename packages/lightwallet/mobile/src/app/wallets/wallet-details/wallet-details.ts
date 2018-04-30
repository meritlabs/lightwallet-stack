import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab, Tabs, Events } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { ContactsService } from '@merit/common/services/contacts.service';

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
  loading: boolean;
  refreshing: boolean;

  offset:number = 0;
  limit:number = 10;

  txs:Array<any> = [];

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private logger: LoggerService,
              private tabsCtrl: Tabs,
              private events: Events,
              private contactsService: ContactsService
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.loading = true;
    this.wallet = this.navParams.get('wallet');
    await this.getWalletHistory();
    this.loading = false;

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

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.getWalletHistory();
    this.refreshing = false;
    refresher.complete();
  }


  private async getWalletHistory() {

    try {
      this.txs = await this.wallet.getTxHistory({skip: 0, limit: this.limit, includeExtendedInfo: true});
      this.wallet.completeHistory = await formatWalletHistory(this.txs, this.wallet, [], this.contactsService);
      console.log(history);
    } catch (e) {
      console.log(e);
    }

  }

  private async loadMoreHistory(infiniter) {
    this.offset += this.limit;
    console.log('loading for offset', this.offset);
    try {
      const txs = await this.wallet.getTxHistory({skip: this.offset, limit: this.limit, includeExtendedInfo: true});
      this.txs = this.txs.concat(txs);
      this.wallet.completeHistory = await formatWalletHistory(this.txs, this.wallet, [], this.contactsService);
      console.log('loaded for offset', this.offset);
    } catch (e) {
      console.log(e);
    }
    infiniter.complete();
  }

}

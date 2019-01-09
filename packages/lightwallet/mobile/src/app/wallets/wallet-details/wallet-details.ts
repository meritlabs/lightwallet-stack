import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ContactsService } from '@merit/common/services/contacts.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { App, Events, IonicPage, NavController, NavParams, Tab, Tabs } from 'ionic-angular';
import { FeeService } from '@merit/common/services/fee.service';

@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView'],
})
@Component({
  selector: 'wallet-details-view',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {
  wallet: MeritWalletClient;
  loading: boolean;
  refreshing: boolean;

  offset: number = 0;
  limit: number = 10;

  txs: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    private app: App,
    private navParams: NavParams,
    private walletService: WalletService,
    private logger: LoggerService,
    private tabsCtrl: Tabs,
    private events: Events,
    private contactsService: ContactsService,
    private persistenceService: PersistenceService2,
    private easyReceiveService: EasyReceiveService,
    private feeService: FeeService,
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.loading = true;
    this.wallet = this.navParams.get('wallet');
    await Promise.all([this.getWalletHistory(), this.getCommunityInfo()]);
    this.loading = false;

    this.events.subscribe('Remote:IncomingTx', () => {
      this.wallet.getStatus();
      this.getWalletHistory();
      this.getCommunityInfo();
    });

    this.easyReceiveService.cancelledEasySend$.subscribe(() => {
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
      this.logger.warn(e);
    }
  }

  async send() {
    this.navCtrl.popToRoot();
    try {
      const nav: Tab = this.tabsCtrl._tabs[3];
      await nav.setRoot('SendView', { wallet: this.wallet });
      await nav.popToRoot();
      await this.tabsCtrl.select(3);
    } catch (e) {
      this.logger.warn(e);
    }
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.getWalletHistory();
    this.wallet.getStatus();
    this.getCommunityInfo();
    this.refreshing = false;
    refresher.complete();
  }

  private async getCommunityInfo() {
    const addressesRewards = await this.wallet.getRewards([this.wallet.getRootAddress()]);
    this.wallet.miningRewards = addressesRewards[0].rewards.mining;
    this.wallet.growthRewards = addressesRewards[0].rewards.ambassador;
  }

  private async getWalletHistory() {
    try {
      this.txs = await this.wallet.getTxHistory({ skip: 0, limit: this.limit, includeExtendedInfo: true });
      await this.formatHistory();
    } catch (e) {
      this.logger.warn(e);
    }
  }

  private async formatHistory() {
    const easySends = await this.wallet.getGlobalSendHistory();
    this.wallet.completeHistory = await formatWalletHistory(
      this.txs,
      this.wallet,
      easySends,
      this.feeService,
      this.contactsService,
    );
  }

  async loadMoreHistory(infiniter) {
    this.offset += this.limit;
    try {
      const txs = await this.wallet.getTxHistory({ skip: this.offset, limit: this.limit, includeExtendedInfo: true });
      this.txs = this.txs.concat(txs);
      await this.formatHistory();
    } catch (e) {
      this.logger.warn(e);
    }
    infiniter.complete();
  }
}

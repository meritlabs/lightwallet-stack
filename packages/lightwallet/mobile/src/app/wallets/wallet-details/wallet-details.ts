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
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import {
  RefreshTransactionsAction,
  selectTransactionsByWalletId,
  selectTransactionsLoading,
} from '@merit/common/reducers/transactions.reducer';
import { getLatestValue } from '@merit/common/utils/observables';

@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView'],
})
@Component({
  selector: 'wallet-details-view',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {

  wallet: DisplayWallet = this.navParams.get('wallet');
  refreshing: boolean;
  transactions$: Observable<IDisplayTransaction[]> = this.store.select(selectTransactionsByWalletId(this.wallet.id));
  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);

  constructor(private navCtrl: NavController,
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
              private store: Store<IRootAppState>,
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.logger.info('Inside the wallet-details view.');
  }

  async ngOnInit() {
    this.easyReceiveService.cancelledEasySend$
      .subscribe(() => {
        this.refreshHistory();
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
    await this.refreshHistory();
    refresher.complete();
  }

  async refreshHistory() {
    this.refreshing = true;
    this.store.dispatch(new RefreshTransactionsAction());
    await getLatestValue(this.loading$, loading => loading === false);
    this.refreshing = false;
  }
}

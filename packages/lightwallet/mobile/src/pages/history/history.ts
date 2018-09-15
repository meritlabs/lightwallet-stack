import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { AddressService } from '@merit/common/services/address.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { FeeService } from '@merit/common/services/fee.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { IonicPage, ModalController } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { Observable } from 'rxjs';
import { selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import {
  RefreshTransactionsAction,
  selectTransactions,
  selectTransactionsLoading,
} from '@merit/common/reducers/transactions.reducer';
import { getLatestValue } from '@merit/common/utils/observables';

@IonicPage()
@Component({
  selector: 'view-history',
  templateUrl: 'history.html',
})
export class HistoryView {
  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  refreshing: boolean;
  transactions$: Observable<IDisplayTransaction[]> = this.store.select(selectTransactions);

  constructor(private profileService: ProfileService,
              private contactsService: ContactsService,
              private modalCtrl: ModalController,
              private easyReceiveService: EasyReceiveService,
              private feeService: FeeService,
              private store: Store<IRootAppState>,
  ) {
  }

  async ionViewDidLoad() {
    this.easyReceiveService.cancelledEasySend$
      .subscribe(() => {
        this.refreshHistory();
      });
  }

  async ionViewWillEnter() {
    await this.refreshHistory();
  }

  async doRefresh(refresher: any) {
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

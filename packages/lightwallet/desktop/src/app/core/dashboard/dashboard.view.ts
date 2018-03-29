import { Component, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { selectWallets, selectWalletsLoading, selectWalletTotals } from '@merit/common/reducers/wallets.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { selectTransactions, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { map } from 'rxjs/operators';
import { isArray } from 'lodash';

@Component({
  selector: 'view-dashboard',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.sass']
})
export class DashboardView {
  amount: number = null;

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  totals$: Observable<any> = this.store.select(selectWalletTotals);
  transactions$: Observable<IDisplayTransaction[]> = this.store.select(selectTransactions).pipe(
    map((transactions: IDisplayTransaction[]) => isArray(transactions)? transactions.slice(0, 5) : [])
  );
  transactionsLoading$: Observable<boolean> = this.store.select(selectTransactionsLoading);

  constructor(private store: Store<IRootAppState>) {}

  sendSubmit($event) {
    if ($event.keyCode === 13) {
      let element: HTMLElement = document.getElementById('sendMrt') as HTMLElement;
      element.click();
    }
  }
}

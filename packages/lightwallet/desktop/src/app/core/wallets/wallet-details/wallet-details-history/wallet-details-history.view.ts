import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectTransactionsByWalletId, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { getLatestValue } from '@merit/common/utils/observables';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'view-wallet-details-history',
  templateUrl: './wallet-details-history.view.html',
  styleUrls: ['./wallet-details-history.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class WalletDetailHistoryView {
  walletId$: Observable<string> = this.route.parent.params.pipe(map(params => params.id));

  transactions$: Observable<IDisplayTransaction[]> = this.walletId$.pipe(
    switchMap(walletId => this.store.select(selectTransactionsByWalletId(walletId))),
  );

  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);

  constructor(private store: Store<IRootAppState>, private route: ActivatedRoute) {}

  async ngOnInit() {}
}

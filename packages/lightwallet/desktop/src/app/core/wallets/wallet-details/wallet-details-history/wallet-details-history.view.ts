import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectTransactionsByWalletId, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-wallet-details-history',
  templateUrl: './wallet-details-history.view.html',
  styleUrls: ['./wallet-details-history.view.sass']
})
export class WalletDetailHistoryView {
  transactions$: Observable<IDisplayTransaction[]> = this.route.parent.params.pipe(
    switchMap(({ id }) => this.store.select(selectTransactionsByWalletId(id)))
  );

  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute) {
  }
}

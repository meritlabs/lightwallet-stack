import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectTransactionsByWalletId, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'view-wallet-details-history',
  templateUrl: './wallet-details-history.view.html',
  styleUrls: ['./wallet-details-history.view.sass'],
  encapsulation: ViewEncapsulation.None
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

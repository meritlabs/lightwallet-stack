import { Component, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectTransactions, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';

@Component({
  selector: 'view-history',
  templateUrl: './history.view.html',
  styleUrls: ['./history.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryView {
  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  transactions$: Observable<IDisplayTransaction[]> = this.store.select(selectTransactions);

  constructor(private store: Store<IRootAppState>) {}
}

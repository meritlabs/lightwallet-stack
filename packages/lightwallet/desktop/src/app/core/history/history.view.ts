import { Component, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectTransactions, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { IHistoryFilters } from '@merit/desktop/app/core/components/history-filters/history-filters.component';

@Component({
  selector: 'view-history',
  templateUrl: './history.view.html',
  styleUrls: ['./history.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryView {
  filters: IHistoryFilters = {
    growth_reward: true,
    mining_reward: true,
    sent: true,
    received: true,
    meritmoney: true,
    meritinvite: true,
    market: true,
    pool_reward: true,
    invite: true,
  };

  private filtersSubj: Subject<IHistoryFilters> = new Subject<IHistoryFilters>();

  filters$: Observable<IHistoryFilters> = this.filtersSubj.asObservable()
    .pipe(
      startWith(this.filters),
    );

  page: number = 1;
  private pageSubj: Subject<number> = new Subject<number>();
  page$: Observable<number> = this.pageSubj.asObservable()
    .pipe(
      startWith(this.page),
    );
  limit: number = 10;

  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  transactions$: Observable<IDisplayTransaction[]> = this.store.select(selectTransactions);
  filteredTransactions$: Observable<IDisplayTransaction[]> = combineLatest(this.transactions$, this.filters$)
    .pipe(
      map(([transactions, filters]) => transactions.filter(tx => filters[tx.action])),
      startWith([]),
    );

  paginatedTransactions$: Observable<IDisplayTransaction[]> = combineLatest(this.filteredTransactions$, this.page$)
    .pipe(
      map(([transactions, page]) => [...transactions].splice((page - 1) * this.limit, this.limit)),
    );

  constructor(private store: Store<IRootAppState>) {

  }

  onPageChange() {
    this.pageSubj.next(this.page);
  }

  onFilterChange() {
    this.page = 1;
    this.onPageChange();
    this.filtersSubj.next(this.filters);
  }
}

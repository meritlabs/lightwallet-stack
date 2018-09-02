import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectTransactionsByWalletId, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { IHistoryFilters } from '@merit/desktop/app/core/components/history-filters/history-filters.component';

@Component({
  selector: 'view-wallet-details-history',
  templateUrl: './wallet-details-history.view.html',
  styleUrls: ['./wallet-details-history.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class WalletDetailHistoryView {
  walletId$: Observable<string> = this.route.parent.params
    .pipe(
      map(params => params.id),
    );

  private filters: IHistoryFilters = {
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

  private page: number = 1;
  private pageSubj: Subject<number> = new Subject<number>();
  private page$: Observable<number> = this.pageSubj.asObservable()
    .pipe(
      startWith(this.page),
    );
  limit: number = 10;

  loading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  transactions$: Observable<IDisplayTransaction[]> = this.walletId$.pipe(
    switchMap(walletId => this.store.select(selectTransactionsByWalletId(walletId))),
  );
  filteredTransactions$: Observable<IDisplayTransaction[]> = combineLatest(this.transactions$, this.filters$)
    .pipe(
      map(([transactions, filters]) => transactions.filter(tx => filters[tx.action])),
      startWith([]),
    );

  paginatedTransactions$: Observable<IDisplayTransaction[]> = combineLatest(this.filteredTransactions$, this.page$)
    .pipe(
      map(([transactions, page]) => [...transactions].splice((page - 1) * this.limit, this.limit)),
    );

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute) {

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

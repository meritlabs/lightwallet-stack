import { Component } from '@angular/core';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectSentInvites, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-invites-history',
  templateUrl: './invites-history.view.html',
  styleUrls: ['./invites-history.view.sass'],
})
export class InvitesHistoryView {
  historyLoading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  history$: Observable<IDisplayTransaction[]> = this.store.select(selectSentInvites);

  constructor(private store: Store<IRootAppState>) {}
}

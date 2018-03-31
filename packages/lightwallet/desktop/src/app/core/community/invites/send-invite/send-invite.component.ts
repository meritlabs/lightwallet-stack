import { Component } from '@angular/core';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectSentInvites, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { selectInvites } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrls: ['./send-invite.component.scss']
})
export class SendInviteComponent {
  historyLoading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  history$: Observable<IDisplayTransaction[]> = this.store.select(selectSentInvites);
  availableInvites$: Observable<number> = this.store.select(selectInvites);

  constructor(private store: Store<IRootAppState>) {}
}

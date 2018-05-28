import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { selectInvites, selectNumberOfInviteRequests } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-invites',
  templateUrl: './invites.view.html',
  styleUrls: ['./invites.view.sass'],
})
export class InvitesView {
  inviteRequests$: Observable<string> = this.store.select(selectNumberOfInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);

  constructor(private store: Store<IRootAppState>) {}
}

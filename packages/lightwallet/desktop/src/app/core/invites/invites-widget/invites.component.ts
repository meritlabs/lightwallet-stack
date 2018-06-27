import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { selectInviteRequests, selectInvites } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-invites-widget',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.sass'],
})
export class InvitesWidgetComponent {
  invites$: Observable<number> = this.store.select(selectInvites);
  inviteRequests$: Observable<any[]> = this.store.select(selectInviteRequests);

  constructor(private store: Store<IRootAppState>) {}
}

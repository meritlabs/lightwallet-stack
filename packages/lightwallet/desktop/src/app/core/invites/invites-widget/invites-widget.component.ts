import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import {
  selectInviteRequests,
  selectInvites,
  selectWalletsWithInvites,
  UpdateInviteRequestsAction,
} from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { InviteRequest } from '@merit/common/services/invite-request.service';
import { getLatestValue } from '@merit/common/utils/observables';

@Component({
  selector: 'app-invites-widget',
  templateUrl: './invites-widget.component.html',
  styleUrls: ['./invites-widget.component.sass'],
})
export class InvitesWidgetComponent {
  invites$: Observable<number> = this.store.select(selectInvites);
  inviteRequests$: Observable<InviteRequest[]> = this.store.select(selectInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  constructor(private store: Store<IRootAppState>) {
  }

  async onInviteRequestRemove(request: InviteRequest) {
    const latest: InviteRequest[] = await getLatestValue(this.inviteRequests$);
    const idx: number = latest.findIndex(request => request.id == request.id);

    if (idx > -1) {
      latest.splice(idx, 1);
      this.store.dispatch(new UpdateInviteRequestsAction(latest));
    }
  }

  shareNow() {
    this.store.dispatch(new SetShareDialogAction(true));
  }
}

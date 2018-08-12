import { Component } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { TaskSlug } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import {
  selectInviteRequests,
  selectInvites,
  selectWalletsWithInvites,
  UpdateInviteRequestsAction,
} from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { InviteRequest } from '@merit/common/services/invite-request.service';
import { getLatestValue } from '@merit/common/utils/observables';

@Component({
  selector: 'view-invite-requests',
  templateUrl: './invite-requests.view.html',
  styleUrls: ['./invite-requests.view.sass'],
})
export class InviteRequestsView {
  inviteRequests$: Observable<InviteRequest[]> = this.store.select(selectInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  isInviteSent: boolean = false;

  receiveRequestTaskSlug: TaskSlug = TaskSlug.ReceiveInviteRequest;
  confirmRequestTaskSlug: TaskSlug = TaskSlug.ConfirmInviteRequest;

  isPendingInvites$: Observable<boolean> = this.inviteRequests$.pipe(map(inviteRequests => inviteRequests.length > 0));

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
}

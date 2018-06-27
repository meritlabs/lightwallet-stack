import { Component } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { TaskSlug } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import {
  IgnoreInviteRequestAction,
  selectInviteRequests,
  selectInvites,
  selectWalletsWithInvites,
} from '@merit/common/reducers/wallets.reducer';
import { IUnlockRequest } from '@merit/common/services/unlock-request.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'view-invite-requests',
  templateUrl: './invite-requests.view.html',
  styleUrls: ['./invite-requests.view.sass'],
})
export class InviteRequestsView {
  inviteRequests$: Observable<IUnlockRequest[]> = this.store.select(selectInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  sending: { [referralId: string]: boolean } = {};
  isInviteSent: boolean = false;

  receiveRequestTaskSlug: TaskSlug = TaskSlug.ReceiveInviteRequest;
  confirmRequestTaskSlug: TaskSlug = TaskSlug.ConfirmInviteRequest;

  isPendingInvites$: Observable<boolean> = this.inviteRequests$.pipe(map(inviteRequests => inviteRequests.length > 0));

  constructor(private store: Store<IRootAppState>) {}
}

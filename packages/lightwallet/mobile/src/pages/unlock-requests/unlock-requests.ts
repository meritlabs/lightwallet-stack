import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { InviteRequest } from '@merit/common/services/invite-request.service';
import { IRootAppState } from '@merit/common/reducers';
import { selectInviteRequests, selectInvites, selectWallets } from '@merit/common/reducers/wallets.reducer';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { selectSentInvites } from '@merit/common/reducers/transactions.reducer';
import { Store } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getLatestDefinedValue } from '@merit/common/utils/observables';

@IonicPage()
@Component({
  selector: 'view-unlock-requests',
  templateUrl: 'unlock-requests.html',
})
export class UnlockRequestsView {

  inviteRequests$: Observable<InviteRequest[]> = this.store.select(selectInviteRequests);
  sentInvites$: Observable<IDisplayTransaction[]> = this.store.select(selectSentInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  availableInvites$: Observable<number> = this.store.select(selectInvites);

  activeTab: 'active' | 'history' = 'active';

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService,
    private store: Store<IRootAppState>,
  ) {
  }

  async ionViewWillEnter() {

    // TODO(ibby): move this block to the display transaction util file
    // const vaults = await this.profileService.getVaults();
    // this.confirmedRequests = this.unlockRequestService.confirmedRequests.map(r => {
    //   let isVault = vaults.some(v => {
    //     return false;
    //     // TODO figure out why referrals address does not match vault address and then enable code below
    //     // if (v.address.toString() == r.address) {
    //     //   r.label = v.name || `vault ${v._id}`;
    //     //   return r.isVault = true;
    //     // }
    //   });
    //   if (!isVault) r.label = r.alias ? '@' + r.alias : r.address;
    //   return r;
    // });
  }

  async processRequest(request: InviteRequest) {
    const availableInvites = await getLatestDefinedValue(this.availableInvites$);
    if (availableInvites === 0) {
      return this.toastCtrl.error('You don\'t have any invites you can spend now');
    }

    this.navCtrl.push('IncomingRequestModal', { request });
  }

  toSendInvite() {
    this.navCtrl.push('SendInviteAmountView');
  }
}

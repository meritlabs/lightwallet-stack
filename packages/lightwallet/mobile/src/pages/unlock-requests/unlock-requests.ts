import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { IUnlockRequest, UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-unlock-requests',
  templateUrl: 'unlock-requests.html',
})
export class UnlockRequestsView {
  hiddenRequests: IUnlockRequest[] = [];
  confirmedRequests: IUnlockRequest[] = [];
  activeRequests: IUnlockRequest[] = [];

  activeTab: 'active' | 'confirmed' = 'active';

  private wallets: Array<MeritWalletClient> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastControllerService,
    private unlockRequestService: UnlockRequestService,
    private profileService: ProfileService,
  ) {}

  async ionViewWillEnter() {
    let vaults = await this.profileService.getVaults();
    this.wallets = await this.profileService.getWallets();

    this.hiddenRequests = this.unlockRequestService.hiddenRequests;
    this.activeRequests = this.unlockRequestService.activeRequests;
    this.confirmedRequests = this.unlockRequestService.confirmedRequests.map(r => {
      let isVault = vaults.some(v => {
        return false;
        // TODO figure out why referrals address does not match vault address and then enable code below
        // if (v.address.toString() == r.address) {
        //   r.label = v.name || `vault ${v._id}`;
        //   return r.isVault = true;
        // }
      });
      if (!isVault) r.label = r.alias ? '@' + r.alias : r.address;
      return r;
    });

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => {
      return nbInvites + wallet.availableInvites;
    }, 0);
  }

  async doRefresh(refresher) {
    Promise.all([this.profileService.refreshData(), this.unlockRequestService.loadRequestsData()]);
    await this.ionViewWillEnter();
    refresher.complete();
  }

  processRequest(request: IUnlockRequest) {
    if (!this.totalInvites) {
      return this.toastCtrl.error("You don't have any invites you can spend now");
    }

    this.navCtrl.push('IncomingRequestModal', {
      request,
      wallets: this.wallets,
    });
  }

  toSendInvite() {
    this.navCtrl.push('SendInviteAmountView');
  }
}

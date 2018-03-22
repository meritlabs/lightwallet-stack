import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ToastConfig } from '@merit/common/services/toast.controller.service';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IUnlockRequest, UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { ProfileService } from '@merit/common/services/profile.service';

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

  private wallets: Array<DisplayWallet> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private unlockRequestService: UnlockRequestService,
    private profileService: ProfileService
            ) {
    this.wallets = this.navParams.get('wallets') || [];
  }

  async ionViewWillEnter() {
    let vaults = await this.profileService.getVaults();

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
        if (!isVault) r.label = r.alias ? '@'+r.alias : r.address;
        return r;
    });

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => nbInvites + wallet.invites, 0);
  }

  processRequest(request: IUnlockRequest) {
    if (!this.totalInvites) {
      return this.toastCtrl.create({
        message: 'You don\'t have any invites you can spend now',
        position: ToastConfig.POSITION,
        duration: ToastConfig.DURATION,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    this.navCtrl.push('IncomingRequestModal', {
      request,
      wallets: this.wallets
    });
  }

  toSendInvite() {
    this.navCtrl.push('SendInviteView', { wallets: this.wallets });
  }
}

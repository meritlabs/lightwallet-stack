import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ToastConfig } from '@merit/common/providers/toast.controller.service';
import { IDisplayWallet } from '@merit/common/models/display-wallet';
import { IUnlockRequest, UnlockRequestService } from '@merit/common/providers/unlock-request.service';

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

  private wallets: Array<IDisplayWallet> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private unlockRequestService: UnlockRequestService) {
    this.wallets = this.navParams.get('wallets');
  }

  async ionViewWillEnter() {
    this.wallets = this.navParams.get('wallets');

    this.hiddenRequests = this.unlockRequestService.hiddenRequests;
    this.activeRequests = this.unlockRequestService.activeRequests;
    this.confirmedRequests = this.unlockRequestService.confirmedRequests;

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => nbInvites + wallet.invites, 0);
  }

  processRequest(request) {
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

import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { ProfileService } from 'merit/core/profile.service';
import { MERIT_MODAL_OPTS } from 'merit/../utils/constants';
import { IDisplayWallet } from 'merit/../models/display-wallet';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

interface IUnlockRequest {
  address: string;
  alias: string;
  isConfirmed: boolean; 
  referralId: string;
  walletClient: MeritWalletClient;
}

@IonicPage()
@Component({
  selector: 'view-pending-invites',
  templateUrl: 'pending-invites.html',
})
export class PendingInvitesView {
  requests: IUnlockRequest[] = [];
  hiddenRequests: IUnlockRequest[] = []; 
  confirmedRequests: IUnlockRequest[] = [];
  activeRequests: IUnlockRequest[] = [];

  private wallets: Array<IDisplayWallet> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;
  
  constructor(
    private navParams: NavParams,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.requests = navParams.get('invites');
    this.wallets = navParams.get('wallets');
  }

  async ionViewDidLoad() {

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => {
        console.log(wallet.invites, 'wallet invites');
        return nbInvites += wallet.invites;
    }, 0);

    let hiddenAddresses = await this.profileService.getHiddenUnlockRequestsAddresses();
    this.requests.forEach(r => {
      if (r.isConfirmed) return this.confirmedRequests.push(r);
      if (hiddenAddresses.indexOf(r.address) != -1) return this.hiddenRequests.push(r);
      return this.activeRequests.push(r);
    });

  }

  processRequest(request) {
    if (!this.totalInvites) {
      return this.toastCtrl.create({
        message: "You dont't have any invites you can spend now",
        position: ToastConfig.POSITION,
        duration: ToastConfig.DURATION,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const modal = this.modalCtrl.create('IncomingRequestModal', {
      request: request,
      wallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((request) => {
      if (request) {
        if (request.isConfirmed) {
           this.confirmRequest(request);
        } else {
           this.hideRequest(request);
        }       
      }
    });
    return modal.present();
  }

  
  private confirmRequest(request:IUnlockRequest) {
      this.hiddenRequests= this.hiddenRequests.filter(r => r.address != request.address); 
      this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
      this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);
      this.confirmedRequests.unshift(request);
  }

  private async hideRequest(request:IUnlockRequest) {
      await this.profileService.hideRequestAddress(request.address);
      this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
      this.hiddenRequests.unshift(request);
      this.activeRequests = this.activeRequests.filter(r => r.address != request.address); 
  }

}

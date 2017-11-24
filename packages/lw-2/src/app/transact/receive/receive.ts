import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { ProfileService } from "merit/core/profile.service";
import { WalletService } from "../../wallets/wallet.service";
import { ToastConfig } from "../../core/toast.config";
import { MeritToastController } from "../../core/toast.controller";
import { Logger } from "../../core/logger";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { PlatformService } from 'merit/core/platform.service';

@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {

  public protocolHandler: string;
  public address: string;
  public qrAddress: string;

  public wallets;
  public wallet;

  public addressGenerationInProgress:boolean;
  public socialSharingAvailable:boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl:ModalController,
    private profileService:ProfileService,
    private walletService:WalletService,
    private loadCtrl:LoadingController,
    private toastCtrl:MeritToastController,
    private logger:Logger,
    private socialSharing: SocialSharing,
    private clipboard:Clipboard,
    private platformService: PlatformService
  ) {
    this.protocolHandler = "merit";
    this.socialSharingAvailable = this.platformService.isCordova;
  }

  async ionViewDidLoad() {
    this.wallets = await this.profileService.getWallets();

    if (this.wallets && this.wallets[0]) {
      this.wallet = this.wallets[0];
      this.generateAddress();
    }
  }

  requestSpecificAmount() {
    let modal = this.modalCtrl.create('AmountView');
    modal.onDidDismiss((amount) => {
       //todo do something
    });

    modal.present();
  }

  generateAddress(forceNew?: boolean) {
    this.addressGenerationInProgress = true;

    this.walletService.getAddress(this.wallet, forceNew).then((address) => {

      this.address = address;
      this.qrAddress = this.protocolHandler + ":" + this.address;
      this.addressGenerationInProgress = false;
    }).catch((err) => {
      this.addressGenerationInProgress = false;
      this.address = null;
      this.qrAddress = null;
      this.logger.warn('Failed to generate new adrress '+err);
      this.toastCtrl.create({
        message: 'Failed to generate new adrress: '+err,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });

  }

  selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
    });
  }

  share() {
    //todo implement social sharing
    this.socialSharing.share('merit:'+this.address);
  }

  copyToClipboard(address) {

    this.clipboard.copy(address);

    this.toastCtrl.create({
      message: 'Address copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  toCopayers() {
    this.navCtrl.push('CopayersView', {walletId: this.wallet.id, wallet: this.wallet});
  }

  shareButtonAvailable() {
    return (
      this.socialSharingAvailable
      && this.wallet
      && this.wallet.isComplete()
    );
  }

}



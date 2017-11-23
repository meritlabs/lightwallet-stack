import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileService } from "merit/core/profile.service";
import { ModalController } from "ionic-angular/index";

import { ToastConfig } from "merit/core/toast.config";
import { Clipboard } from '@ionic-native/clipboard';
import { MeritToastController } from "merit/core/toast.controller";
import { SocialSharing } from '@ionic-native/social-sharing';
import { WalletService } from "merit/wallets/wallet.service";
import { TxFormatService } from "merit/transact/tx-format.service";


// Network View 
// Part of the Community Tab.
@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  public wallets:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileService:ProfileService,
    private clipboard:Clipboard,
    private toastCtrl:MeritToastController,
    private socialSharing: SocialSharing,
    private walletService:WalletService,
    private txFormatService:TxFormatService
  ) {

  }

  async ionViewDidLoad() {
    //do something here
    this.wallets = await this.profileService.getWallets();

    this.wallets.forEach((wallet:any) => {
      this.walletService.getANV(wallet).then((anv) => {
        wallet.amount = this.txFormatService.parseAmount(anv, 'MRT').amountUnitStr;
      });

      this.walletService.getRewards(wallet).then((data) => {
        wallet.address = data.address;
        wallet.miningRewards = this.txFormatService.parseAmount(data.rewards.mining, 'MRT').amountUnitStr;
        wallet.ambassadorRewards = this.txFormatService.parseAmount(data.rewards.ambassador, 'MRT').amountUnitStr;
      });
    });

  }


  copyToClipboard(code) {
    this.clipboard.copy(code);

    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  shareCode(code) {
    this.socialSharing.share('My invite code to use Merit: '+code);
  }

  shareAddress(address) {
    this.socialSharing.share('merit'+address);
  }


}

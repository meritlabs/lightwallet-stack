import { Component } from '@angular/core';
import { IonicPage, App, LoadingController, ToastController } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import {ToastConfig} from "merit/core/toast.config";

// Unlock view for wallet
@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'view-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockView {

  public unlockState:'success'|'fail';
  public formData = {unlockCode: ''};

  constructor(
    private app:App,
    private walletService: WalletService,
    private toastCtrl: ToastController,
    private loaderCtrl:LoadingController
  ) {
  }

  ionViewDidLoad() {
    //do something here
  }

  createAndUnlockWallet(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!this.formData.unlockCode) {
        this.unlockState = 'fail';
      } else {

        let loader = this.loaderCtrl.create({content: 'Creating wallet...'});
        loader.present();

        this.walletService.createDefaultWallet(this.formData.unlockCode).then((wallet) => {
          console.debug('created wallet', wallet);
          loader.dismiss();

          /** todo store wallet */

          this.app.getRootNav().setRoot('TransactView');
          resolve(wallet);
        }).catch((err) => {
          loader.dismiss();
          this.unlockState = 'fail';
          this.toastCtrl.create({ message: err, cssClass: ToastConfig.CLASS_ERROR }).present();
          reject(err);
        });
      }
    });
    
  }

}

import { Component } from '@angular/core';
import { IonicPage, App, LoadingController, NavController } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import * as Promise from 'bluebird';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';


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

  public easyReceipt:EasyReceipt;

  constructor(
    private app:App,
    private walletService: WalletService,
    private toastCtrl: MeritToastController,
    private loaderCtrl: LoadingController, 
    private navCtrl: NavController,
    private easyReceiveService:EasyReceiveService
  ) {
      
  }

  ionViewDidLoad() {
    
    this.easyReceiveService.getPendingReceipts().then((receipts) => {
      this.easyReceipt = receipts.pop();
      if (this.easyReceipt) this.formData.unlockCode = this.easyReceipt.unlockCode;
    });

  }

  createAndUnlockWallet(): Promise<any> {
    
    return new Promise((resolve, reject) => {

      if (!this.formData.unlockCode) {
        this.unlockState = 'fail';
      } else {

        let loader = this.loaderCtrl.create({content: 'Creating wallet...'});
        loader.present();

        return this.walletService.createDefaultWallet(this.formData.unlockCode).then((wallet) => {
          console.debug('created wallet', wallet);
          loader.dismiss();

          /** todo store wallet */

          // Now that we are unlocked, we no longer need these other views in the stack, 
          // so we shall destroy them.
          this.navCtrl.setRoot('TransactView');
          this.navCtrl.popToRoot();
          return resolve(wallet);
        }).catch((err) => {
          loader.dismiss();
          this.unlockState = 'fail';
          this.toastCtrl.create({ message: JSON.stringify(err), cssClass: ToastConfig.CLASS_ERROR }).present();
        });
      }
    });
    
  }

}

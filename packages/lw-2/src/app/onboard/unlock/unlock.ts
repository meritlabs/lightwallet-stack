import { Component } from '@angular/core';
import { IonicPage, App, LoadingController, NavController } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import * as Promise from 'bluebird';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { Logger } from 'merit/core/logger';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';


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
    private navParams: NavParams,
    private easyReceiveService: EasyReceiveService,
    private logger: Logger
  ) {
      
  }

  ionViewDidLoad() {
    // An unlock code from a friend sharing the link. 
    this.formData.unlockCode = this.navParams.get('unlockCode') || '';
    
    this.easyReceiveService.getPendingReceipts().then((receipts) => {
      this.easyReceipt = receipts.pop();
      // The unlock code from a pending easyReceipt takes priority.
      if (this.easyReceipt) this.formData.unlockCode = this.easyReceipt.unlockCode;
    });

  }

  createAndUnlockWallet() {

    if (!this.formData.unlockCode) {
      this.unlockState = 'fail';
      return;
    }

    let loader = this.loaderCtrl.create({content: 'Creating wallet...'});
    loader.present();
    return this.walletService.createDefaultWallet(this.formData.unlockCode).then((wallet) => {
      this.logger.debug('created wallet', wallet);
      loader.dismiss();
      this.navCtrl.setRoot('TransactView');
      this.navCtrl.popToRoot();
    }).catch((err) => {
        loader.dismiss();
        if (err == Errors.UNLOCK_CODE_INVALID) this.unlockState = 'fail';
        this.logger.debug("Could not unlock wallet: ", err);
        this.toastCtrl.create({ message: err.text, cssClass: ToastConfig.CLASS_ERROR }).present();
    });

  }

}

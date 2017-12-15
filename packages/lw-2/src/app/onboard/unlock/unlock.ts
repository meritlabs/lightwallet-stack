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
import { ConfigService } from 'merit/shared/config.service';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';


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
    private logger: Logger,
    private config: ConfigService,
    private pushNotificationService: PushNotificationsService,
    private pollingNotificationService: PollingNotificationsService
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

  createAndUnlockWallet(): Promise<any> {
    
    return new Promise((resolve, reject) => {

      if (!this.formData.unlockCode) {
        this.unlockState = 'fail';
      } else {

        let loader = this.loaderCtrl.create({content: 'Creating wallet...'});
        loader.present();

        return this.walletService.createDefaultWallet(this.formData.unlockCode).then((wallet) => {
          this.logger.info('Created a new default wallet: ', wallet);
          loader.dismiss();
          if (this.config.get().pushNotificationsEnabled) {
            this.logger.info("Subscribing to push notifications for default wallet");
            this.pushNotificationService.subscribe(wallet);
          } else {
            this.logger.info("Subscribing to long polling for default wallet");
            this.pollingNotificationService.enablePolling(wallet);
          }
          

          // Now that we are unlocked, we no longer need these other views in the stack, 
          // so we shall destroy them.
          this.navCtrl.setRoot('TransactView');
          this.navCtrl.popToRoot();
          return resolve(wallet);
        }).catch((err) => {
          loader.dismiss();
          this.unlockState = 'fail';
          this.logger.debug("Could not unlock wallet: ", err);
          this.toastCtrl.create({ message: JSON.stringify(err), cssClass: ToastConfig.CLASS_ERROR }).present();
        });
      }
    });
    
  }

}

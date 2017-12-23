import { Component } from '@angular/core';
import { IonicPage, App, LoadingController, NavController } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import * as Promise from 'bluebird';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { Logger } from 'merit/core/logger';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { ConfigService } from 'merit/shared/config.service';
import { PushNotificationsService } from 'merit/core/notification/push-notification.service';
import { PollingNotificationsService } from 'merit/core/notification/polling-notification.service';

// Unlock view for wallet
@IonicPage({
  defaultHistory: ['OnboardingView'],
})
@Component({
  selector: 'view-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockView {
  public unlockState: 'success' | 'fail';
  public formData = { parentAddress: '' };

  public easyReceipt: EasyReceipt;

  constructor(
    private app: App,
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
  ) {}

  ionViewDidLoad() {
    // An unlock code from a friend sharing the link.
    this.formData.parentAddress = this.navParams.get('parentAddress') || '';

    this.easyReceiveService.getPendingReceipts().then(receipts => {
      this.easyReceipt = receipts.pop();
      // The unlock code from a pending easyReceipt takes priority.
      if (this.easyReceipt) this.formData.parentAddress = this.easyReceipt.parentAddress;
    });
  }

  createWallet(): Promise<any> {
    if (!this.formData.parentAddress) {
      this.unlockState = 'fail';
      return;
    }

    let loader = this.loaderCtrl.create({ content: 'Creating wallet...' });
    loader.present();

    return this.walletService
      .createDefaultWallet(this.formData.parentAddress)
      .then(wallet => {
        this.logger.info('Created a new default wallet!');
        loader.dismiss();

        if (this.config.get().pushNotificationsEnabled) {
          this.logger.info('Subscribing to push notifications for default wallet');
          this.pushNotificationService.subscribe(wallet);
        } else {
          this.logger.info('Subscribing to long polling for default wallet');
          this.pollingNotificationService.enablePolling(wallet);
        }

        // Now that we are unlocked, we no longer need these other views in the stack,
        // so we shall destroy them.
        this.navCtrl.setRoot('TransactView');
        this.navCtrl.popToRoot();
      })
      .catch(err => {
        loader.dismiss();
        if (err == Errors.UNLOCK_CODE_INVALID) this.unlockState = 'fail';
        this.logger.debug('Could not unlock wallet: ', err);
        this.toastCtrl.create({ message: err.text || 'Unknown error', cssClass: ToastConfig.CLASS_ERROR }).present();
      });
  }
}

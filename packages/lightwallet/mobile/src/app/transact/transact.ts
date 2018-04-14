import { Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import {
  AlertController,
  Events,
  IonicPage,
  NavController,
  NavParams,
  Platform,
  Tabs,
  ToastController
} from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { EasyReceipt } from '../../../../common/models/easy-receipt';
import { EasyReceiveService } from '../../../../common/services/easy-receive.service';
import { ToastConfig } from '../../../../common/services/toast.controller.service';

@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'view-transact',
  templateUrl: 'transact.html',
  host: {
    '[class.keyboard-visible]': 'keyboardVisible'
  }
})
export class TransactView {
  @ViewChild('tabs') tabs: Tabs;

  private subs: Subscription[];
  keyboardVisible: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logger: LoggerService,
              private profileService: ProfileService,
              private plt: Platform,
              private keyboard: Keyboard,
              private unlockRequestService: UnlockRequestService,
              private easyReceiveService: EasyReceiveService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private events: Events) {
  }

  async ngOnInit() {
    if (this.plt.is('android') && Keyboard.installed()) {
      this.subs = [
        this.keyboard.onKeyboardShow()
          .subscribe(() => {
            this.keyboardVisible = true;
          }),
        this.keyboard.onKeyboardHide()
          .subscribe(() => {
            this.keyboardVisible = false;
          })
      ];
    }

    await this.unlockRequestService.loadRequestsData();
  }

  async ngOnDestroy() {
    if (this.subs && this.subs.length) {
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  async ionViewCanEnter() {
    const wallets = await this.profileService.wallets;
    return wallets && wallets.length > 0;
  }

  ionViewDidEnter() {
    return this.processPendingEasyReceipts();
  }

  /**
   * gets easyReceipt data from the blockchain and routes the ui accordingly
   *
   * @private
   * @param {EasyReceipt} receipt
   * @param {boolean} isRetry
   * @param {string} password
   * @returns {Promise<void>}
   * @memberof WalletsView
   */
  private async processEasyReceipt(receipt: EasyReceipt, isRetry: boolean, password: string = '') {
    const data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, password);
    let txs = data.txs;

    if (!txs) return await this.easyReceiveService.deletePendingReceipt(receipt);

    if (!Array.isArray(txs)) {
      txs = [txs];
    }

    if (!txs.length) return this.showPasswordEasyReceivePrompt(receipt, isRetry);

    if (txs.some(tx => tx.spent)) {
      this.logger.debug('Got a spent easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    if (txs.some(tx => (tx.confirmations === undefined))) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return this.showConfirmEasyReceivePrompt(receipt, data);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
      this.logger.debug('Got an expired easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    return this.showConfirmEasyReceivePrompt(receipt, data);
  }

  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private async processPendingEasyReceipts(): Promise<any> {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (!receipts.length) return; // No receipts to process
    return this.processEasyReceipt(receipts[0], false);
  }

  /**
   * Shows easy receive popup with password input. Input is highlighted red when password is incorrect
   * @param receipt
   * @param highlightInvalidInput
   */
  private showPasswordEasyReceivePrompt(receipt: EasyReceipt, highlightInvalidInput = false) {
    this.logger.info('show alert', highlightInvalidInput);
    this.alertCtrl.create({
      title: `You've got merit from ${receipt.senderName}!`,
      cssClass: highlightInvalidInput ? 'invalid-input-prompt' : '',
      inputs: [{ name: 'password', placeholder: 'Enter password', type: 'password' }],
      buttons: [
        {
          text: 'Ignore', role: 'cancel', handler: () => {
            this.logger.info('You have declined easy receive');
            this.easyReceiveService.deletePendingReceipt(receipt).then(() =>
              this.processPendingEasyReceipts()
            );
          }
        },
        {
          text: 'Validate', handler: (data) => {
            if (!data || !data.password) {
              this.showPasswordEasyReceivePrompt(receipt, true); //the only way we can validate password input by the
                                                                 // moment
            } else {
              this.processEasyReceipt(receipt, true, data.password);
            }
          }
        }
      ]
    }).present();
  }

  /**
   * Shows after receipt is validated with correct password (or with no pass if no one set)
   * @param receipt
   * @param data
   */
  private async showConfirmEasyReceivePrompt(receipt: EasyReceipt, data) {

    let amount = await this.easyReceiveService.getReceiverAmount(data.txs);

    this.alertCtrl.create({
      title: `You've got ${amount} Merit!`,
      buttons: [
        {
          text: 'Reject', role: 'cancel', handler: () => {
            this.rejectEasyReceipt(receipt, data).then(() =>
              this.processPendingEasyReceipts()
            );
          }
        },
        {
          text: 'Accept', handler: () => {
            this.acceptEasyReceipt(receipt, data).then(() =>
              this.processPendingEasyReceipts()
            );
          }
        }
      ]
    }).present();
  }

  private showSpentEasyReceiptAlert() {
    this.alertCtrl.create({
      title: 'Uh oh',
      message: 'It seems that the Merit from this link has already been redeemed!',
      buttons: [
        'Ok'
      ]
    }).present();
  }

  private showExpiredEasyReceiptAlert() {
    this.alertCtrl.create({
      title: 'Uh oh',
      subTitle: 'It seems that this transaction has expired. ',
      message: 'The Merit from this link has not been lost! ' +
      'You can ask the sender to make a new transaction.',
      buttons: [
        'Ok'
      ]
    }).present();
  }

  private async acceptEasyReceipt(receipt: EasyReceipt, data: any): Promise<any> {
    try {
      const wallets = await this.profileService.getWallets();
      // TODO: Allow a user to choose which wallet to receive into.
      let wallet = wallets[0];
      if (!wallet) throw 'no wallet';

      const address = wallet.getRootAddress();
      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address.toString());

      this.logger.info('accepted easy send', acceptanceTx);

      // update wallet info
      this.events.publish('Remote:IncomingTx');
    } catch (err) {
      console.log(err);
      this.toastCtrl.create({
        message: 'There was an error retrieving your incoming payment.',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  private rejectEasyReceipt(receipt: EasyReceipt, data): Promise<any> {

    return this.profileService.getWallets().then((wallets) => {

      //todo implement wallet selection UI
      let wallet = wallets[0];
      if (!wallet) return Promise.reject(new Error('Could not retrieve wallet.'));

      return this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data).then(() => {
        this.logger.info('Easy send returned');
      }).catch((err) => {
        console.log(err);
        this.toastCtrl.create({
          message: err.text || 'There was an error rejecting the Merit',
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
      });
    });
  }

  countUnlockRequests() {
    return this.unlockRequestService.activeRequestsNumber;
  }
}

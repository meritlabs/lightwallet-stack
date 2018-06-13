import { Component, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { Keyboard } from '@ionic-native/keyboard';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { Address, PublicKey } from 'bitcore-lib';
import {
  AlertController,
  Events,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Platform,
  Tabs
} from 'ionic-angular';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { PersistenceService2, ViewSettingsKey } from '@merit/common/services/persistence2.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { SmsNotificationsModal } from '../../modals/sms-notifications/sms-notifications';


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

  private subs: Subscription[] = [];
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
              private toastCtrl: ToastControllerService,
              private events: Events,
              private modalCtrl: ModalController,
              private persistenceService2: PersistenceService2,
              private smsNotificationsService: SmsNotificationsService) {
  }

  async ngOnInit() {
    this.subs.push(
      this.easyReceiveService.easyReceipts$
        .pipe(
          startWith(null),
          debounceTime(500),
          tap(() => {
            this.processPendingEasyReceipts();
          })
        )
        .subscribe(),
      this.easyReceiveService.cancelEasySendObservable$.subscribe(
        receipt => {
          this.processEasyReceipt(receipt, false, '', false);
        }
      )
    );

    if (this.plt.is('android') && Keyboard.installed()) {
      this.subs.push(
        this.keyboard.onKeyboardShow()
          .subscribe(() => {
            this.keyboardVisible = true;
          }),
        this.keyboard.onKeyboardHide()
          .subscribe(() => {
            this.keyboardVisible = false;
          })
      );
    }

    await this.unlockRequestService.loadRequestsData();
  }

  async ngOnDestroy() {
    if (this.subs && this.subs.length) {
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  async ionViewCanEnter() {
    const wallets = await this.profileService.wallets || [];
    return wallets.length > 0;
  }

  async ionViewDidEnter() {
    const smsPromptSetting = await this.persistenceService2.getViewSettings(ViewSettingsKey.SmsNotificationsPrompt);

    if (smsPromptSetting == true)
      return;

    const smsNotificationStatus = await this.smsNotificationsService.getSmsSubscriptionStatus();

    if (smsNotificationStatus.enabled)
      return;

    const modal = this.modalCtrl.create('SmsNotificationsModal');
    modal.present();
    modal.onDidDismiss(() => {
      this.persistenceService2.setViewSettings(ViewSettingsKey.SmsNotificationsPrompt, true);
    });
  }

  private async processPendingEasyReceipts() {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (!receipts.length) return; // No receipts to process
    return this.processEasyReceipt(receipts[0], false);
  }

  /**
   * gets easyReceipt data from the blockchain and routes the ui accordingly
   *
   * @private
   * @param {EasyReceipt} receipt
   * @param {boolean} isRetry
   * @param {string} password
   * @param {boolean} processAll
   * @returns {Promise<void>}
   * @memberof WalletsView
   */
  private async processEasyReceipt(receipt: EasyReceipt, isRetry: boolean, password: string = '', processAll: boolean = true) {
    const data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, password);
    let txs = data.txs;

    if (!txs) return await this.easyReceiveService.deletePendingReceipt(receipt);

    if (!Array.isArray(txs)) {
      txs = [txs];
    }

    if (!txs.length) return this.showPasswordEasyReceivePrompt(receipt, isRetry, processAll);

    const wallets = await this.profileService.getWallets();
    const wallet = wallets[0];

    //Decide if the wallet is the sender of the Global Send.
    //We will prompt here to cancel the global send instead.
    const address = wallet.getRootAddress().toString();
    const senderPublicKey = new PublicKey(receipt.senderPublicKey);
    const senderAddress = senderPublicKey.toAddress(ENV.network).toString();
    const isSender = senderAddress == address;

    if (txs.some(tx => tx.spent)) {
      this.logger.debug('Got a spent easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    if (txs.some(tx => (tx.confirmations === undefined))) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return isSender ?
        this.showCancelEasyReceivePrompt(receipt, data) :
        this.showConfirmEasyReceivePrompt(receipt, data);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
      this.logger.debug('Got an expired easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return processAll ? this.processPendingEasyReceipts() : null;
    }

    return isSender ?
      this.showCancelEasyReceivePrompt(receipt, data) :
      this.showConfirmEasyReceivePrompt(receipt, data);
  }

  /**
   * Shows easy receive popup with password input. Input is highlighted red when password is incorrect
   * @param receipt
   * @param highlightInvalidInput
   */
  private showPasswordEasyReceivePrompt(receipt: EasyReceipt, highlightInvalidInput = false, processAll: boolean) {
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
              this.showPasswordEasyReceivePrompt(receipt, true, processAll); //the only way we can validate password
                                                                             // input by the
            } else {
              this.processEasyReceipt(receipt, true, data.password, processAll);
            }
          }
        }
      ]
    }).present();
  }

  private async showCancelEasyReceivePrompt(receipt: EasyReceipt, data) {

    const amountStr = await this.getAmountStr(data.txs);
    const name = (await this.easyReceiveService.isInviteOnly(data.txs)) ? 'MeritInvite' : 'MeritMoney';

    this.alertCtrl.create({
      title: `Cancel your own ${name} link?`,
      message: `You clicked on a ${name} link that you created. Would you like to cancel ${name} link with ${ amountStr }?`,
      buttons: [
        {
          text: `Don't Cancel`,
          handler: () => {
            this.easyReceiveService.deletePendingReceipt(receipt);
          }
        },
        {
          text: `Cancel ${name}`,
          handler: () => {
            this.cancelEasyReceipt(receipt);
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

    const amountStr = await this.getAmountStr(data.txs);

    this.alertCtrl.create({
      title: `You've got ${amountStr}!`,
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

  private async getAmountStr(txs) {
    let amountStr = '';
    if (await this.easyReceiveService.isInviteOnly(txs)) {
      const invitesAmount = await this.easyReceiveService.getInvitesAmount(txs);
      amountStr = (invitesAmount == 1) ? 'Invite Token' : invitesAmount + ' Invite tokens';
    } else {
      amountStr = await this.easyReceiveService.getReceiverAmount(txs) + ' Merit';
    }
    return amountStr;
  }

  private showSpentEasyReceiptAlert() {
    this.alertCtrl.create({
      title: 'Uh oh',
      message: 'It seems that the MeritLink has already been redeemed!',
      buttons: [
        'Ok'
      ]
    }).present();
  }

  private showExpiredEasyReceiptAlert() {
    this.alertCtrl.create({
      title: 'Uh oh',
      subTitle: 'It seems that this transaction has expired. ',
      message: 'Transaction was returned to sender! ' +
      'You can ask the sender to make a new transaction.',
      buttons: [
        'Ok'
      ]
    }).present();
  }


  private async cancelEasyReceipt(receipt: EasyReceipt): Promise<any> {
    try {
      const wallets = await this.profileService.getWallets();
      let wallet = wallets[0];
      if (!wallet) throw new Error('Could not retrieve wallet');

      const acceptanceTx = await this.easyReceiveService.cancelEasySendReceipt(wallet, receipt, '', '');
      this.events.publish('Remote:IncomingTx');
      this.logger.info('Canceled easy send', acceptanceTx);
    } catch (err) {
      console.log(err);
      this.toastCtrl.error('There was an error cancelling your MeritMoney link.');
    }
  }

  private async acceptEasyReceipt(receipt: EasyReceipt, data: any): Promise<any> {
    try {
      const wallets = await this.profileService.getWallets();
      // TODO: Allow a user to choose which wallet to receive into.
      let wallet = wallets[0];
      if (!wallet) throw new Error('Could not retrieve wallet');

      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(wallet, receipt, data, wallet.rootAddress.toString());
      this.logger.info('accepted easy send', acceptanceTx);

      this.events.publish('Remote:IncomingTx'); // update wallet info
    } catch (err) {
      console.log(err);
      this.toastCtrl.error('There was an error retrieving your incoming payment.');
    }
  }

  private async rejectEasyReceipt(receipt: EasyReceipt, data): Promise<any> {

    try {
      // TODO: Allow a user to choose which wallet to receive into.
      const wallets = await this.profileService.getWallets();
      let wallet = wallets[0];
      if (!wallet) throw new Error('Could not retrieve wallet');
      await this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data);
      this.logger.info('Easy send returned');
    } catch (err) {
      console.log(err);
      this.toastCtrl.error(err.text || 'There was an error rejecting the Merit');
    }

  }

  countUnlockRequests() {
    return this.unlockRequestService.activeRequestsNumber;
  }
}

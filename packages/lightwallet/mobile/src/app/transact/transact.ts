import { Component, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { Keyboard } from '@ionic-native/keyboard';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
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
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { InviteRequestsService } from '@merit/common/services/invite-request.service';
import { Observable } from 'rxjs';
import { selectNumberOfInviteRequests } from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';


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

  nInviteRequests$: Observable<string> = this.store.select(selectNumberOfInviteRequests);

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logger: LoggerService,
              private profileService: ProfileService,
              private plt: Platform,
              private keyboard: Keyboard,
              private inviteRequestService: InviteRequestsService,
              private easyReceiveService: EasyReceiveService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastControllerService,
              private events: Events,
              private modalCtrl: ModalController,
              private persistenceService2: PersistenceService2,
              private smsNotificationsService: SmsNotificationsService,
              private store: Store<IRootAppState>) {
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

    const smsPromptSetting = await this.persistenceService2.getUserSettings(UserSettingsKey.SmsNotificationsPrompt);

    if (smsPromptSetting == true)
      return;

    const smsNotificationStatus = await this.smsNotificationsService.getSmsSubscriptionStatus();

    if (smsNotificationStatus.enabled)
      return;

    const modal = this.modalCtrl.create('SmsNotificationsModal');
    modal.present();
    modal.onDidDismiss(() => {
      this.persistenceService2.setUserSettings(UserSettingsKey.SmsNotificationsPrompt, true);
    });
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

    if (!txs.length) return this.showPasswordEasyReceivePrompt(receipt,  data);


    if (txs.some(tx => tx.spent)) {
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    if (txs.some(tx => (tx.confirmations === undefined))) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return this.showEasyReceivePrompt(receipt, data);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
      this.logger.debug('Got an expired easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return processAll ? this.processPendingEasyReceipts() : null;
    }

    return this.showEasyReceivePrompt(receipt, data);
  }

  /**
   * Shows easy receive popup with password input.
   */
  private showPasswordEasyReceivePrompt(receipt: EasyReceipt,data) {
    const modal = this.modalCtrl.create('GlobalsendReceiveView', {mode: 'validate', receipt, data});
    modal.onDidDismiss(() => {
      this.processPendingEasyReceipts();
    });
    modal.present();
  }

  /**
   * @param receipt
   */
  private showEasyReceivePrompt(receipt: EasyReceipt, data) {
    const modal = this.modalCtrl.create('GlobalsendReceiveView', {mode: 'receive', receipt, data});
    modal.onDidDismiss(() => {
      this.processPendingEasyReceipts();
    });
    modal.present();
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
}

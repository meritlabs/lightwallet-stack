import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IVault } from '@merit/common/models/vault';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { AlertController, IonicPage, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html'
})
export class WalletsView {

  totalInvites: number;
  totalAmount: number;

  wallets: Array<any> = []; //todo display wallet or meritwalletclient?
  vaults: IVault[] = [];

  loading: boolean; //initial load, no data displayed
  refreshing: boolean; //soft data refresh

  constructor(private navCtrl: NavController,
              private logger: LoggerService,
              private easyReceiveService: EasyReceiveService,
              private toastCtrl: MeritToastController,
              private profileService: ProfileService,
              private alertController: AlertController,
              private platform: Platform) {
    this.logger.debug('WalletsView constructor!');
  }

  async ngOnInit() {
    this.logger.debug('Hello WalletsView :: IonViewDidLoad!');
    this.platform.resume.subscribe(() => {
      this.logger.info('WalletView is going to refresh data on resume.');
      if (this.isActivePage) {
        this.refreshing = true;
        this.updateAllInfo().then(() => this.refreshing = false);
      }
    });
  }

  private get isActivePage(): boolean {
    try {
      return this.navCtrl.last().instance instanceof WalletsView;
    } catch (e) {
      return false;
    }
  }

  async ionViewDidLoad() {
    this.loading = true;
    try {
      this.wallets = await this.profileService.getWallets();
      this.vaults = await this.profileService.getVaults();
      this.setTotalValues();
      this.loading = false;
      this.refreshing = true;
      await this.updateAllInfo();
    } catch (e) {} finally {
      this.loading = false;
      this.refreshing = true;
    }
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    this.vaults = await this.profileService.getVaults();
    this.refreshing = true;
    await this.updateAllInfo();
    this.refreshing = false;
  }

  async doRefresh(refresher) {
    this.refreshing = true;
    await this.updateAllInfo();
    this.refreshing = false;
    refresher.complete();
  }

  toAddWallet() {
    let referralAddress = '';
    this.wallets.some(w => {
      if (w.availableInvites) return referralAddress = w.rootAddress;
    });
    return this.navCtrl.push('CreateWalletView', { parentAddress: referralAddress });
  }

  async updateAllInfo() {
    try {
      await this.profileService.refreshData();
      this.setTotalValues();
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  private setTotalValues() {
    this.totalInvites = this.wallets.reduce((number, w) => {
      return number + w.availableInvites;
    }, 0);

    let totalAmount = this.wallets.reduce((amount, w) => {
      return amount + w.balance.spendableAmount;
    }, 0);

    totalAmount += this.vaults.reduce((amount, v) => {
      return amount + v.amount;
    }, 0);

    this.totalAmount = totalAmount;
  }


  /**
   * gets easyReceipt data from the blockchain and routes the ui accordingly
   *
   * @private
   * @param {EasyReceipt} receipt
   * @param {boolean} isRetry
   * @returns {Promise<void>}
   * @memberof WalletsView
   */
  private async processEasyReceipt(receipt: EasyReceipt, isRetry: boolean, password: string = ''): Promise<void> {
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
    this.alertController.create({
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

    this.alertController.create({
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
    this.alertController.create({
      title: 'Uh oh',
      message: 'It seems that the Merit from this link has already been redeemed!',
      buttons: [
        'Ok'
      ]
    }).present();
  }

  private showExpiredEasyReceiptAlert() {
    this.alertController.create({
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
      return this.updateAllInfo();
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

}



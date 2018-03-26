import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoggerService } from '@merit/common/services/logger.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { IVault } from '@merit/common/models/vault';
import { AddressService } from '@merit/common/services/address.service';
import { FeeService } from '@merit/common/services/fee.service';
import { RateService } from '@merit/common/services/rate.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { VaultsService } from '@merit/common/services/vaults.service';

@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {

  totalInvites: number;
  totalAmount: number;

  wallets: Array<any> = []; //todo display wallet or meritwalletclient?
  vaults: IVault[] = [];

  loading: boolean; //initial load, no data displayed
  refreshing: boolean; //soft data refresh

  constructor(
              private navCtrl: NavController,
              private logger: LoggerService,
              private easyReceiveService: EasyReceiveService,
              private toastCtrl: MeritToastController,
              private profileService: ProfileService,
              private alertController: AlertController,
              private platform: Platform,
              private feeService: FeeService,
              private rateService: RateService,
              private walletService: WalletService,
              private vaultsService: VaultsService
  ) {
    this.logger.debug('WalletsView constructor!');
  }

  async ngOnInit() {
    this.logger.debug('Hello WalletsView :: IonViewDidLoad!');
    this.platform.resume.subscribe(() => {
      this.logger.info('WalletView is going to refresh data on resume.');
      if (this.isActivePage) {
        //todo refresh all info
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
    } catch (e) {} finally  {
      this.loading = false;
      this.refreshing = true;
    }
  }

  async ionViewWillEnter() {
    if (this.loading) return;
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
    let referralAdderss = '';
    this.wallets.some(w => {
      if (w.status.availableInvites) return referralAdderss = w.rootAddress;
    });
    return this.navCtrl.push('CreateWalletView', { parentAddress: referralAdderss });
  }

  async updateAllInfo() {
    try {

      let updateWallets = () => this.wallets.map((w) => {
        w.status = this.walletService.getStatus(w, { force: true });
      });

      let updateVaults = () => this.vaults.map(async (v) => {
        v = await this.vaultsService.getVaultInfo(v);
      });

      await Promise.all(updateWallets().concat(updateVaults()));

      this.profileService.wallets = this.wallets;
      this.profileService.vaults = this.vaults;
      this.profileService.storeProfile();
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
      return number + w.status.availableInvites;
    }, 0);

    let totalAmount = this.wallets.reduce((amount, w) => {
      return amount + w.status.spendableAmount;
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
  private async processEasyReceipt(receipt: EasyReceipt, isRetry: boolean): Promise<void> {
    const data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, '');
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
            this.showPasswordEasyReceivePrompt(receipt, true); //the only way we can validate password input by the moment
          } else {
            this.processEasyReceipt(receipt, true);
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

    let amount = data.txs.find((tx:any) => !tx.invite).amount || 0;
    amount -= this.rateService.microsToMrt( await this.feeService.getEasyReceiveFee() );

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



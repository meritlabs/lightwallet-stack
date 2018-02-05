import { ApplicationRef, Component, NgZone } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform, AlertController, App, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { AppUpdateService } from 'merit/core/app-update.service';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { Feedback } from 'merit/feedback/feedback.model'
import { FeedbackService } from 'merit/feedback/feedback.service'
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { ConfigService } from 'merit/shared/config.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { RateService } from 'merit/transact/rate.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { Observable } from 'rxjs/Observable';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

const RETRY_MAX_ATTEMPTS = 5;
const RETRY_TIMEOUT = 1000;


/*
  TODO:
  -- Ensure that we get navParams and then fallback to the wallet service.
*/
@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {

  totalNetworkValue;
  totalNetworkValueMicros;
  totalNetworkValueFiat;

  wallets: MeritWalletClient[];
  vaults;
  feedbackNeeded: boolean;
  feedbackData = new Feedback();

  addressbook;
  txpsData: any[] = [];
  network: string;

  loading: boolean;
  public formData = { inviteTo: '' };

  private get isActivePage(): boolean {
    return this.navCtrl.last().instance instanceof WalletsView;
  }

  private isRefreshingAllInfo: boolean = false;

  constructor(public navParams: NavParams,
              private navCtrl: NavController,
              private app: App,
              private logger: Logger,
              private bwcService: BwcService,
              private easyReceiveService: EasyReceiveService,
              private toastCtrl: MeritToastController,
              private appUpdateService: AppUpdateService,
              private profileService: ProfileService,
              private feedbackService: FeedbackService,
              private inAppBrowser: InAppBrowser,
              private configService: ConfigService,
              private alertController: AlertController,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private events: Events,
              private addressbookService: AddressBookService,
              private vaultsService: VaultsService,
              private applicationRef: ApplicationRef,
              private zone: NgZone,
              private rateService: RateService,
              private platform: Platform
  ) {
    this.logger.warn('WalletsView constructor!');
  }

  async doRefresh(refresher) {
    try {
      await this.refreshAllInfo();
    } catch (e) {}
    refresher.complete();
  }

  async refreshAllInfo() {
    if (this.isRefreshingAllInfo) return;
    this.isRefreshingAllInfo = true;
    await this.updateAllInfo({ force: true });
    this.isRefreshingAllInfo = false;
  }

  async ionViewDidLoad() {
    this.logger.warn('Hello WalletsView :: IonViewDidLoad!');
    this.platform.resume.subscribe(() => {
      this.logger.info('WalletView is going to refresh data on resume.');
      if (this.isActivePage) {
        this.refreshAllInfo();
      }
    });

    await this.updateAllInfo({ force: true });
    this.logger.info('Got updated data in walletsView on Ready!!');
  }

  async updateAllInfo(opts: { force: boolean } = { force: false }) {

    this.loading = true;

    const fetch = async () => {
      this.addressbook = await this.addressbookService.list(this.configService.getDefaults().network.name);
      const wallets = await this.updateAllWallets(opts.force);

      if (_.isEmpty(wallets)) {
        return null; //ToDo: add proper error handling;
      }

      this.wallets = wallets;

      // Now that we have wallets, we will proceed with the following operations in parallel.
      await Promise.all([
        this.updateNetworkValue(wallets),
        this.processPendingEasyReceipts(),
        this.updateTxps({ limit: 3 }),
        this.updateVaults(_.head(this.wallets))
      ]);

      console.log(wallets);

      this.logger.info('Done updating all info for wallet.');
    };

    await Observable.defer(() => fetch())
      .retryWhen(errors =>
        errors.zip(Observable.range(1, RETRY_MAX_ATTEMPTS))
          .mergeMap(([err, attempt]) => {
            this.logger.info('Error updating information for all wallets.');
            this.logger.info(err);

            if (err.code == Errors.CONNECTION_ERROR.code || err.code == Errors.SERVER_UNAVAILABLE.code) {
              if (attempt < RETRY_MAX_ATTEMPTS) {
                return Observable.timer(RETRY_TIMEOUT);
              }
            }

            this.toastCtrl.create({
              message: err.text || 'Failed to update information',
              cssClass: ToastConfig.CLASS_ERROR
            }).present();

            return Observable.of();
          })
      )
      .toPromise();

    this.loading = false;
  }

  openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersView')
    } else {
      this.navCtrl.push('WalletDetailsView', { walletId: wallet.id, wallet: wallet });
    }
  }

  async sendInvite(wallet) {

    const toAddress = this.formData.inviteTo;
    try {
      await this.walletService.sendInvite(wallet, toAddress);

      this.formData.inviteTo = '';
      this.toastCtrl.create({
        message: 'Invite successfully sent',
        cssClass: ToastConfig.CLASS_MESSAGE
      }).present();
    } catch (e) {
      console.error(e.message);
      this.toastCtrl.create({
        message: 'Failed to send invite',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
  }

  sendFeedback() {
    this.feedbackNeeded = false;
    this.feedbackService.sendFeedback(this.feedbackData).catch(() => {
      this.toastCtrl.create({
        message: 'Failed to send feedback. Please try again later',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    })
  }

  toLatestRelease() {
    this.inAppBrowser.create(this.configService.get().release.url);
  }

  toAddWallet() {

    if (!_.isEmpty(this.wallets)) {
      const parentAddress = this.bwcService.getBitcore().PrivateKey(
        this.wallets[0].credentials.walletPrivKey,
        this.wallets[0].network
      ).toAddress().toString();

      return this.navCtrl.push('CreateWalletView', {
        updateWalletListCB: this.refreshWalletList.bind(this),
        parentAddress
      });
    }
    return this.navCtrl.push('CreateWalletView', { updateWalletListCB: this.refreshWalletList.bind(this) });
  }

  toImportWallet() {
    this.navCtrl.push('ImportView');
  }

  // This is a callback used when a new wallet is created.
  async refreshWalletList() {
    this.wallets = await this.updateAllWallets();
  }

  async refreshVaultList() {
    return this.updateVaults(await this.profileService.getHeadWalletClient());
  }

  txpCreatedWithinPastDay(txp) {
    const createdOn = new Date(txp.createdOn * 1000);
    return ((new Date()).getTime() - createdOn.getTime()) < (1000 * 60 * 60 * 24);
  }

  walletHasPendingAmount(wallet: any): boolean {
    try {
      if (wallet.status && wallet.status.balance) {
        return Number(wallet.status.balance.totalAmount) !== Number(wallet.status.balance.confirmedAmount);
      }
    } catch (e) {}

    return false;
  }

  private async updateTxps({ limit } = { limit: 3 }): Promise<any> {
    this.txpsData = await this.profileService.getTxps({ limit });
  }

  private async updateVaults(wallet: MeritWalletClient): Promise<any> {
    const vaults = await this.vaultsService.getVaults(wallet);
    this.logger.info('getting vaults', vaults);
    this.vaults = await Promise.all(vaults.map(async vault => {
      let coins = await this.vaultsService.getVaultCoins(wallet, vault);
      vault.amount = _.sumBy(coins, 'micros');
      await this.txFormatService.toFiat(vault.amount, wallet.cachedStatus.alternativeIsoCode);
      vault.altAmountStr = new FiatAmount(vault.altAmount).amountStr;
      vault.amountStr = this.txFormatService.formatAmountStr(vault.amount);
      return vault;
    }));
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

    if (!data.txn.found) return this.showPasswordEasyReceivePrompt(receipt, isRetry); // requires different password

    if (data.txn.spent) {
      this.logger.debug('Got a spent easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return this.processPendingEasyReceipts();
    }

    if (_.isUndefined(data.txn.confirmations)) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return this.showConfirmEasyReceivePrompt(receipt, data);
    }

    if (receipt.blockTimeout < data.txn.confirmations) {
      this.logger.debug('Got an expired easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return this.processPendingEasyReceipts();
    }

    return this.showConfirmEasyReceivePrompt(receipt, data);
  }

  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private async processPendingEasyReceipts(): Promise<any> {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (_.isEmpty(receipts)) return; // No receipts to process
    return this.processEasyReceipt(receipts[0], false);
  }

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

  private showConfirmEasyReceivePrompt(receipt: EasyReceipt, data) {
    this.alertController.create({
      title: `You've got ${data.txn.amount} Merit!`,
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
      if (!wallet) return Promise.reject('no wallet');
      let forceNewAddress = false;

      const address = await this.walletService.getAddress(wallet, forceNewAddress);
      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address.address);

      this.logger.info('accepted easy send', acceptanceTx);
    } catch (err) {
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
        this.toastCtrl.create({
          message: err.text || 'There was an error rejecting the Merit',
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
      });
    });
  }

  private async updateNetworkValue(wallets: Array<any>) {
    let totalAmount: number = 0;

    await Promise.all(wallets.map(async (wallet) => {
      totalAmount += await this.walletService.getANV(wallet);
    }));

    const usdAmount = await this.txFormatService.formatToUSD(totalAmount);
    this.totalNetworkValueFiat = new FiatAmount(+usdAmount).amountStr;
    this.totalNetworkValue = totalAmount;
    this.totalNetworkValueMicros = this.txFormatService.parseAmount(this.totalNetworkValue, 'micros').amountUnitStr;
  }

  private rateApp(mark) {
    this.feedbackData.mark = mark;
  }

  private cancelFeedback() {
    this.feedbackData.mark = null;
  }

  private async updateAllWallets(force: boolean = false): Promise<MeritWalletClient[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all(wallets.map(async (wallet) => {
      this.profileService.updateWalletSettings(wallet);
      wallet.status = await this.walletService.getStatus(wallet, { force: force });
      return wallet;
    }));
  }

  private needWalletStatuses(): boolean {
    if (_.isEmpty(this.wallets)) {
      return true;
    }

    _.each(this.wallets, (wallet) => {
      if (!wallet.status) {
        return true;
      }
    });
    return false;
  }



}

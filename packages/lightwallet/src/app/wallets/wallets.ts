import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { EasyReceipt } from 'merit/easy-receive/easy-receipt.model';
import { EasyReceiveService } from 'merit/easy-receive/easy-receive.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { Observable } from 'rxjs/Observable';
import { createDisplayWallet, IDisplayWallet } from '../../models/display-wallet';
import { MeritWalletClient } from '../../lib/merit-wallet-client/index';

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

  totalInvites: number;
  totalWalletsValueMicros: string;
  totalWalletsValueFiat: string;
  allBalancesHidden: boolean;
  wallets: IDisplayWallet[];
  vaults;
  network: string;
  loading: boolean;

  private get isActivePage(): boolean {
    try {
      return this.navCtrl.last().instance instanceof WalletsView;
    } catch (e) {
      return false;
    }
  }

  private isRefreshingAllInfo: boolean = false;

  constructor(public navParams: NavParams,
              private navCtrl: NavController,
              private logger: Logger,
              private bwcService: BwcService,
              private easyReceiveService: EasyReceiveService,
              private toastCtrl: MeritToastController,
              private profileService: ProfileService,
              private alertController: AlertController,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private vaultsService: VaultsService,
              private platform: Platform) {
    this.logger.debug('WalletsView constructor!');
  }

  async doRefresh(refresher) {
    try {
      await this.refreshAllInfo();
    } catch (e) {
    }
    refresher.complete();
  }

  async refreshAllInfo() {
    if (this.isRefreshingAllInfo) return;
    this.isRefreshingAllInfo = true;
    await this.updateAllInfo();
    this.isRefreshingAllInfo = false;
  }

  async ngOnInit() {
    this.logger.debug('Hello WalletsView :: IonViewDidLoad!');
    this.platform.resume.subscribe(() => {
      this.logger.info('WalletView is going to refresh data on resume.');
      if (this.isActivePage) {
        this.refreshAllInfo();
      }
    });
  }

  ionViewWillEnter() {
    this.refreshAllInfo()
      .then(() => this.logger.info('Updated info for wallets view'))
  }

  async updateAllInfo() {
    this.loading = true;

    const fetch = async () => {
      this.wallets = await this.updateAllWallets();
      // Now that we have wallets, we will proceed with the following operations in parallel.
      await Promise.all([
        this.updateNetworkValue(),
        this.processPendingEasyReceipts(),
        this.updateVaults(_.head(this.wallets).client)
      ]);

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

  isAddress(address: string) {
    try {
      this.bwcService.getBitcore().Address.fromString(address);
      return true;
    } catch (_e) {
      return false;
    }
  }

  toAddWallet() {
    if (!_.isEmpty(this.wallets)) {
      // todo check for existing invites and suggest the wallet that has any
      const referralAdderss = this.walletService.getRootAddress(this.wallets[0].client);

      return this.navCtrl.push('CreateWalletView', {
        updateWalletListCB: this.refreshWalletList.bind(this),
        parentAddress: referralAdderss
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
    let txs = data.txs;

    if (!_.isArray(txs)) {
      txs = [txs];
    }

    if (!txs.length) {
      return this.showPasswordEasyReceivePrompt(receipt, isRetry);
    }

    if (txs.some(tx => tx.spent)) {
      this.logger.debug('Got a spent easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return this.processPendingEasyReceipts();
    }

    if (txs.some(tx => _.isUndefined(tx.confirmations))) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return this.showConfirmEasyReceivePrompt(receipt, data);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
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
    const amount = _.get(_.find(data.txs, (tx: any) => !tx.invite), 'amount', 0);

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
      if (!wallet) return Promise.reject('no wallet');
      let forceNewAddress = false;

      const address = this.walletService.getRootAddress(wallet);
      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address.toString());

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

  private async updateNetworkValue() {
    let totalAmount: number = 0,
      totalInvites: number = 0,
      allBalancesHidden: boolean = true;

    this.wallets.forEach((w: IDisplayWallet) => {
      totalAmount += w.totalBalanceMicros;
      totalInvites += w.invites;
      allBalancesHidden = w.client.balanceHidden && allBalancesHidden;
    });

    const usdAmount = await this.txFormatService.formatToUSD(totalAmount);

    if (!(this.allBalancesHidden = allBalancesHidden)) {
      this.totalWalletsValueFiat = usdAmount ? new FiatAmount(+usdAmount).amountStr : '';
      this.totalWalletsValueMicros = this.txFormatService.parseAmount(totalAmount, 'micros').amountUnitStr;
    }

    this.totalInvites = totalInvites;
  }

  private async updateAllWallets(): Promise<IDisplayWallet[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all<IDisplayWallet>(
      wallets.map(w => createDisplayWallet(w, this.walletService, null, { skipRewards: true, skipAlias: true }))
    );
  }

}

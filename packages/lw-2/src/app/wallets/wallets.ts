import { Component, ApplicationRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, Events } from 'ionic-angular';

import * as _ from "lodash";
import * as Promise from 'bluebird';
import { ProfileService } from "merit/core/profile.service";
import { FeedbackService } from "merit/feedback/feedback.service"
import { Feedback } from "merit/feedback/feedback.model"
import { AppUpdateService } from "merit/core/app-update.service";
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConfigService } from "merit/shared/config.service";

import { EasyReceiveService } from "merit/easy-receive/easy-receive.service";
import { Logger } from "merit/core/logger";
import { WalletService } from "merit/wallets/wallet.service";
import { EasyReceipt } from "merit/easy-receive/easy-receipt.model";
import { TxFormatService } from "merit/transact/tx-format.service";
import { AddressBookService } from "merit/shared/address-book/address-book.service";
import { VaultsService } from 'merit/vaults/vaults.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { RateService } from 'merit/transact/rate.service';
import { Platform } from 'ionic-angular/platform/platform';



/* 
  Using bluebird promises! 
  This gives us the ability to map over items and 
  engage in async requests.

  TODO: 
  -- Ensure that we get navParams and then fallback to the wallet service.
*/
@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {

  private totalNetworkValue;
  private totalNetworkValueMicros;
  private totalNetworkValueFiat;

  public wallets: MeritWalletClient[];
  public vaults;
  public newReleaseExists: boolean;
  public feedbackNeeded: boolean;
  public showFeaturesBlock: boolean = false;
  public feedbackData = new Feedback();

  public addressbook;
  public txpsData: any[] = [];
  public recentTransactionsData: any[] = [];
  public recentTransactionsEnabled;
  public network: string;

  constructor(
    public navParams: NavParams,
    private navCtrl: NavController,
    private app: App,
    private logger: Logger,
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
    this.logger.warn("Hellop WalletsView!");
    this.platform.resume.subscribe(() => {
      this.logger.info("WalletView is going to refresh data on resume.");
      this.updateAllInfo({ force: true }).then(() => {
        this.logger.info("Got updated data in walletsView on resume.")
      });
    });
  
    this.updateAllInfo({ force: true }).then(() => {
      this.logger.info("Got updated data in walletsView on Ready!!")
    });
  }

  public doRefresh(refresher) {
    this.updateAllInfo().then(() => {
      refresher.complete();
    }).catch(() => {
      refresher.complete();
    });
  }

  public ionViewDidLoad() {
    this.logger.warn("Hello WalletsView :: IonViewDidLoad!");
  }

  // public async showFeaturesBlock(): Promise<boolean> {
  //   return (this.newReleaseExists || this.feedbackNeeded);
  // }
  private updateAllInfo(opts: { force: boolean } = { force: false }): Promise<any> {
    return new Promise((resolve, reject) => {

      return this.addressbookService.list('testnet').then((addressBook) => {
        this.addressbook = addressBook;
        return this.updateAllWallets(opts.force);
      }).then((wallets) => {
        if (_.isEmpty(wallets)) {
          return resolve(null); //ToDo: add proper error handling;
        }
        this.wallets = wallets;

        // Now that we have wallets, we will proceed with the following operations in parallel.
        return Promise.join(
          this.updateNetworkValue(wallets),
          this.processEasyReceive(),
          this.updateTxps({limit: 3}),
          this.updateVaults(_.head(this.wallets)),
          this.fetchNotifications(),
          (res) => {
            this.logger.info("Done updating all info for wallet.")
            return resolve();
          }
        )
      }).catch((err) => {
        this.logger.info("Error updating information for all wallets.");
        this.logger.info(err);
        this.toastCtrl.create({
          message: 'Failed to update information',
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
        return resolve();
      });
    });
  }

  private updateTxps(opts:{ limit:number } = { limit: 3} ): Promise<any> {
    return this.profileService.getTxps({ limit: 3 }).then((txps) => {
      this.txpsData = txps;
      return Promise.resolve();
    });
  }

  private updateVaults(wallet: MeritWalletClient): Promise<any> {
    return this.vaultsService.getVaults(wallet).then((vaults) => {
      this.logger.info('getting vaults', vaults);
      return Promise.map(vaults, (vault) => {
        return this.vaultsService.getVaultCoins(wallet, vault).then((coins) => {
          vault.amount = _.sumBy(coins, 'micros');
          vault.altAmount = this.rateService.fromMeritToFiat(vault.amount, wallet.cachedStatus.alternativeIsoCode);
          vault.altAmountStr = new FiatAmount(vault.altAmount);
          vault.amountStr = this.txFormatService.formatAmountStr(vault.amount);
          return vault;
        });
      }).then((vaults) => {
        this.vaults = vaults;
      });
  });
  }

  private fetchNotifications(): Promise<any> {
    this.logger.info("What is the recentTransactionsEnabled status?");
    this.logger.info(this.configService.get().recentTransactions.enabled);
    if (this.configService.get().recentTransactions.enabled) {
      this.recentTransactionsEnabled = true;
      return this.profileService.getNotifications({ limit: 3 }).then((result) => {
        this.logger.info("Show me the notifications: ", result);
        this.logger.info("WalletsView Received ${result.total} notifications upon resuming.");
        _.each(result.notifications, (n: any) => {
          // We don't need to update the status here because it has 
          // already been fetched as part of updateAllInfo();
          this.processIncomingTransactionEvent(n, { updateStatus: false });
        });
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  }

  private processIncomingTransactionEvent(n: any, opts: { updateStatus: boolean } = { updateStatus: false }): void {
    if (_.isEmpty(n)) {
      return;
    }

    if (n.type) {
      switch (n.type) {
        case 'IncomingTx':
          n.actionStr = 'Payment Received';
          break;
        case 'IncomingCoinbase':
          n.actionStr = 'Mining Reward';
          break;
        default:
          n.actionStr = 'Recent Transaction';
          break
      }
    }

    // TODO: Localize
    if (n.data && n.data.amount) {
      n.amountStr = this.txFormatService.formatAmountStr(n.data.amount);
      this.txFormatService.formatToUSD(n.data.amount).then((usdAmount) => {
        n.fiatAmountStr = new FiatAmount(usdAmount).amountStr;
       
        // Let's make sure we don't have this notification already.
        let duplicate = _.find(this.recentTransactionsData, n);
        this.logger.info("duplicate notifications? : ", duplicate);
        if (_.isEmpty(duplicate)) {
          // We use angular's NgZone here to ensure that the view re-renders with new data.
          // There may be a better way to do this.  
          // TODO: Investigate why events.subscribe() does not appear to run inside 
          // the angular zone.
          this.zone.run(() => {
            this.recentTransactionsData.push(n);
          });
        }
      });
    }

    // Update the status of the wallet in question.
    // TODO: Consider revisiting the mutation approach here. 
    if (n.walletId && opts.updateStatus) {
      // Check if we have a wallet with the notification ID in the view.
      // If not, let's skip. 
      let foundIndex = _.findIndex(this.wallets, { 'id': n.walletId });
      if (!this.wallets[foundIndex]) {
        return;
      }
      this.walletService.invalidateCache(this.wallets[foundIndex]);

      Promise.all([
        this.walletService.getStatus(this.wallets[foundIndex]).then((status) => {
          // Using angular's NgZone to ensure that the view knows to re-render.
          this.zone.run(() => {
            this.wallets[foundIndex].status = status;
          });
        }),
        this.updateNetworkValue
      ]);


    }
  }

  /**
   * Here, we register listeners that act on relevent Ionic Events
   * These listeners process event data, and also retrieve additional data
   * as needed.
   */
  private registerListeners(): void {


    this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
      this.logger.info("RL: Got an IncomingTx event with: ", walletId, type, n);

      this.processIncomingTransactionEvent(n, { updateStatus: true });
    });

    this.events.subscribe('Remote:IncomingCoinbase', (walletId, type, n) => {
      this.logger.info("RL: Got an IncomingCoinbase event with: ", walletId, type, n);

      this.processIncomingTransactionEvent(n, { updateStatus: true });
    });

  }
  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private processEasyReceive(): Promise<any> {
    return this.easyReceiveService.getPendingReceipts().then((receipts) => {
      if (receipts[0]) {

        return this.easyReceiveService.validateEasyReceiptOnBlockchain(receipts[0], '').then((data) => {
          if (data) {
            this.showConfirmEasyReceivePrompt(receipts[0], data);
          } else { //requires password
            this.showPasswordEasyReceivePrompt(receipts[0]);
          }
        });
      }
      return Promise.resolve();
    });
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
            this.easyReceiveService.deletePendingReceipt(receipt).then(() => {
              this.processEasyReceive();
            });
          }
        },
        {
          text: 'Validate', handler: (data) => {
            if (!data || !data.password) {
              this.showPasswordEasyReceivePrompt(receipt, true); //the only way we can validate password input by the moment 
            } else {
              this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, data.password).then((data) => {
                if (!data) { // incorrect
                  this.showPasswordEasyReceivePrompt(receipt, true);
                } else {
                  this.showConfirmEasyReceivePrompt(receipt, data);
                }
              });
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
            this.rejectEasyReceipt(receipt, data).then(() => {
              this.processEasyReceive();
            });
          }
        },
        {
          text: 'Accept', handler: () => {
            this.acceptEasyReceipt(receipt, data).then(() => {
              this.processEasyReceive();
            });
          }
        }
      ]
    }).present();
  }


  private acceptEasyReceipt(receipt: EasyReceipt, data: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this.profileService.getWallets().then((wallets) => {
        // TODO: Allow a user to choose which wallet to receive into.
        let wallet = wallets[0];
        if (!wallet) return reject('no wallet');
        let forceNewAddress = false;
        this.walletService.getAddress(wallet, forceNewAddress).then((address) => {

          this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address).then((acceptanceTx) => {
            this.logger.info('accepted easy send', acceptanceTx);
            resolve();
          });

        }).catch((err) => {
          this.toastCtrl.create({
            message: "There was an error retrieving your incoming payment.",
            cssClass: ToastConfig.CLASS_ERROR
          });
          reject();
        });

      });

    });
  }

  private rejectEasyReceipt(receipt: EasyReceipt, data): Promise<any> {

    return new Promise((resolve, reject) => {

      this.profileService.getWallets().then((wallets) => {

        //todo implement wallet selection UI 
        let wallet = wallets[0];
        if (!wallet) return reject(new Error('Could not retrieve wallet.'));

        this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data).then(() => {
          this.logger.info('Easy send returned');
          resolve();
        }).catch(() => {
          this.toastCtrl.create({
            message: 'There was an error rejecting the Merit',
            cssClass: ToastConfig.CLASS_ERROR
          }).present();
          reject();
        });

      });
    });


  }

  private updateNetworkValue(wallets: Array<any>): Promise<any> {
    let totalAmount: number = 0;
    Promise.each(wallets, (wallet) => {
      return this.walletService.getANV(wallet).then((anv) => {
        totalAmount += anv;
      });
    }).then(() => {
      this.totalNetworkValue = totalAmount;
      this.totalNetworkValueMicros = this.txFormatService.parseAmount(this.totalNetworkValue, 'micros').amountUnitStr;
      this.txFormatService.formatToUSD(this.totalNetworkValue).then((usdAmount) => {
        this.totalNetworkValueFiat = new FiatAmount(usdAmount).amountStr;
      });
    });
    return Promise.resolve();
  }

  private openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersView')
    } else {
      this.navCtrl.push('WalletDetailsView', { walletId: wallet.id, wallet: wallet });
    }
  }

  private rateApp(mark) {
    this.feedbackData.mark = mark;
  }

  private cancelFeedback() {
    this.feedbackData.mark = null;
  }

  private sendFeedback() {
    this.feedbackNeeded = false;
    this.feedbackService.sendFeedback(this.feedbackData).catch(() => {
      this.toastCtrl.create({
        message: 'Failed to send feedback. Please try again later',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    })
  }

  private toLatestRelease() {
    this.inAppBrowser.create(this.configService.get().release.url);
  }

  private toAddWallet() {
    this.navCtrl.push('CreateWalletView');
  }

  private toImportWallet() {
    this.navCtrl.push('ImportView');
  }

  private updateAllWallets(force: boolean = false): Promise<MeritWalletClient[]> {
    return this.profileService.getWallets().map((wallet: any) => {
      this.profileService.updateWalletSettings(wallet);
      return this.walletService.getStatus(wallet, { force: force }).then((status) => {
        wallet.status = status;
        return wallet;
      }).catch((err) => {
        return Promise.reject(new Error('could not update wallets' + err));
      });
    })
  }

  private openTransactionDetails(transaction) {
    this.navCtrl.push('TransactionView', { transaction: transaction });
  }

  private toTxpDetails() {
    this.navCtrl.push('TxpView');
  }

  private txpCreatedWithinPastDay(txp) {
    var createdOn = new Date(txp.createdOn * 1000);
    return ((new Date()).getTime() - createdOn.getTime()) < (1000 * 60 * 60 * 24);
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

  private openRecentTxDetail(tx: any): any {
    this.navCtrl.push('TxDetailsView', { walletId: tx.walletId, txId: tx.data.txid })
  }

}

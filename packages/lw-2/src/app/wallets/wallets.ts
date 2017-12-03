import { Component, ApplicationRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';

import * as _ from "lodash";
import * as Promise from 'bluebird';
import { ProfileService } from "merit/core/profile.service";
import { FeedbackService } from "merit/feedback/feedback.service"
import { Feedback } from "merit/feedback/feedback.model"
import { AppUpdateService } from "merit/core/app-update.service";
import { ToastConfig } from "../core/toast.config";
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
  public feedbackData =  new Feedback();

  public addressbook;
  public txpsData: any[] = [];
  public recentTransactionsData;

  public recentTransactionsEnabled;
  public network:string;

  constructor(
    public navParams: NavParams,
    private navCtrl:NavController,
    private app:App,
    private logger:Logger,
    private easyReceiveService:EasyReceiveService,
    private toastCtrl:ToastController,
    private appUpdateService:AppUpdateService,
    private profileService:ProfileService,
    private feedbackService:FeedbackService,
    private inAppBrowser:InAppBrowser,
    private configService:ConfigService,
    private alertController:AlertController,
    private walletService:WalletService,
    private txFormatService:TxFormatService,
    private events:Events,
    private addressbookService:AddressBookService,
    private vaultsService: VaultsService,
    private applicationRef: ApplicationRef, 
    private zone: NgZone
  ) {
    this.logger.warn("Hellop WalletsView!");
  }

  public doRefresh(refresher) {
    this.updateAllInfo().then(() => {
      refresher.complete();
    }).catch(() => {
      refresher.complete();
    });
  }

  public async ionViewDidLoad() {
      this.logger.warn("Hellop WalletsView :: IonViewDidLoad!");
      this.registerListeners();
      await this.updateAllInfo();
  }

  public showFeaturesBlock(): boolean {
    return (this.newReleaseExists || this.feedbackNeeded);
  }
  private updateAllInfo():Promise<any> {

    return new Promise((resolve, reject) => {

    return this.appUpdateService.isUpdateAvailable().then((available) => {
      this.newReleaseExists = available;
      return this.feedbackService.isFeedBackNeeded();
    }).then((feedbackNeeded) => {
      this.feedbackNeeded = feedbackNeeded;
      return this.addressbookService.list('testnet');
    }).then((addressBook) => {
      this.addressbook = addressBook;
      return this.getWallets();
    }).then((wallets) => {
        this.wallets = wallets;
        return this.calculateNetworkAmount(wallets);
      }).then((cNetworkAmount) => {
        this.totalNetworkValue = cNetworkAmount;
        this.totalNetworkValueMicros = this.txFormatService.parseAmount(this.totalNetworkValue, 'micros').amountUnitStr;
        this.txFormatService.formatToUSD(this.totalNetworkValue).then((usdAmount) => {
          this.totalNetworkValueFiat = new FiatAmount(usdAmount).amountStr;
        });
        return this.processEasyReceive();
      }).then(() => {
        return this.profileService.getTxps({limit: 3});
      }).then((txps) => {
        this.txpsData = txps;
        if (this.configService.get().recentTransactions.enabled) {
          this.recentTransactionsEnabled = true;
          this.recentTransactionsData = this.profileService.getNotifications({limit: 3});
        }
        return Promise.resolve();

      }).then(() => {
        if (_.isEmpty(this.wallets)) {
          return Promise.resolve([]);
        } else {
          return this.vaultsService.getVaults(_.head(this.wallets));
        }
      }).then((vaults) => {
        this.vaults = vaults;
        return resolve();
      }).catch((err) => {
        console.log("Could not update wallet status(es).");
        console.log(err);
        return resolve();
      });
      return this.processEasyReceive();
    });
  }

  private processIncomingTransactionEvent(n:any): void {
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
          // We use angular's NgZone here to ensure that the view re-renders with new data.
          // There may be a better way to do this.  
          // TODO: Investigate why events.subscribe() does not appear to run inside 
          // the angular zone.
          this.zone.run(() => {
            this.recentTransactionsData.push(n);
          });
        });
      }

      // Update the status of the wallet in question.
      // TODO: Consider revisiting the mutation approach here. 
      if (n.walletId) {
        // Check if we have a wallet with the notification ID in the view.
        // If not, let's skip. 
        let foundIndex = _.findIndex(this.wallets, {'id': n.walletId});
        if (!this.wallets[foundIndex]) {
          return;
        }
        this.walletService.invalidateCache(this.wallets[foundIndex]);
        this.walletService.getStatus(this.wallets[foundIndex]).then((status) => {
          // Using angular's NgZone to ensure that the view knows to re-render.
          this.zone.run(() => {
            this.wallets[foundIndex].status = status;
          });
        });
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
      
      this.processIncomingTransactionEvent(n);      
    });
    
    this.events.subscribe('Remote:IncomingCoinbase', (walletId, type, n) => {
      this.logger.info("RL: Got an IncomingCoinbase event with: ", walletId, type, n);
      
      this.processIncomingTransactionEvent(n);      
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

  private showPasswordEasyReceivePrompt(receipt:EasyReceipt, highlightInvalidInput = false) {

    this.logger.info('show alert', highlightInvalidInput); 

    this.alertController.create({
      title: `You've got merit from ${receipt.senderName}!`,
      cssClass: highlightInvalidInput ? 'invalid-input-prompt' : '', 
      inputs:  [{name: 'password', placeholder: 'Enter password',type: 'password'}],
      buttons: [
        {text: 'Ignore', role: 'cancel', handler: () => {
          this.logger.info('You have declined easy receive');
            this.easyReceiveService.deletePendingReceipt(receipt).then(() => {
              this.processEasyReceive();
            });
          }
        },
        {text: 'Validate', handler: (data) => {
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

  private showConfirmEasyReceivePrompt(receipt:EasyReceipt, data) {
  
    this.alertController.create({
      title: `You've got ${data.txn.amount} Merit!`,
      buttons: [
        {text: 'Reject', role: 'cancel', handler: () => {
            this.rejectEasyReceipt(receipt, data).then(() => {
                this.processEasyReceive();
            });
          }
        },
        {text: 'Accept', handler: () => { 
          this.acceptEasyReceipt(receipt, data).then(() => {
            this.processEasyReceive();
        });
        }}
      ]
    }).present();
  }


  private acceptEasyReceipt(receipt:EasyReceipt, data:any):Promise<any> {

    return new Promise((resolve, reject) => {
      
      this.getWallets().then((wallets) => {
        
          let wallet = wallets[0];
          if (!wallet) return reject('no wallet');
          let forceNewAddress = false;
          this.walletService.getAddress(wallet, forceNewAddress).then((address) => {

            this.easyReceiveService.acceptEasyReceipt(receipt, wallet , data, address).then((acceptanceTx) => {
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

  private rejectEasyReceipt(receipt:EasyReceipt, data):Promise<any> {
    
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

  private calculateNetworkAmount(wallets:Array<any>):Promise<any> {
    let totalAmount = 0;

    wallets.forEach((wallet) => {
      totalAmount += wallet.status.totalBalanceSat;
    });

    return Promise.resolve(totalAmount);
  }

  private openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersView')
    } else {
      this.navCtrl.push('WalletDetailsView', {walletId: wallet.id, wallet: wallet});
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

  // This method returns all wallets with statuses.  
  // Statuses include balances and other important metadata 
  // needed to power the display. 
  private getWallets():Promise<Array<MeritWalletClient>> {
    this.logger.warn("getWallets() in wallets.ts");

    return this.updateAllWallets().then((wallets) => {
      return wallets;
    });

  }

  private updateAllWallets(): Promise<MeritWalletClient[]> {
    return this.profileService.getWallets().each((wallet) => {
      return this.walletService.getStatus(wallet).then((status) => {
        wallet.status = status;
        return Promise.resolve(wallet);
      }).catch((err) => {
        Promise.reject(new Error('could not update wallets' + err));
      });
    })
  }

  private openTransactionDetails(transaction) {
    this.navCtrl.push('TransactionView', {transaction: transaction});
  }

  private toTxpDetails() {
    this.navCtrl.push('TxpView');
  }

  private txpCreatedWithinPastDay(txp) {
    var createdOn= new Date(txp.createdOn*1000);
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

  private openRecentTxDetail(tx:any): any {
    this.navCtrl.push('TxDetailsView', {walletId: tx.walletId, txId: tx.data.txid})
  }

}

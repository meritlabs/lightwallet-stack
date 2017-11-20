import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';
import { Wallet } from "./wallet.model";

import * as _ from "lodash";
import { Promise } from 'bluebird';
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

  private totalAmount;
  private totalAmountFormatted;

  public wallets;
  public newReleaseExists;
  public feedbackNeeded;
  public feedbackData =  new Feedback();

  public addressbook;
  public txpsData;
  public recentTransactionsData;

  public recentTransactionsEnabled;

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
    private addressbookService:AddressBookService
  ) {
    this.logger.warn("Hellop WalletsView!");
    
  }


  public async ionViewDidLoad() {
    this.logger.warn("Hellop WalletsView :: IonViewDidLoad!");
    

    this.registerListeners();
    this.newReleaseExists = await this.appUpdateService.isUpdateAvailable();
    this.feedbackNeeded   = await this.feedbackService.isFeedBackNeeded();
    this.addressbook = await this.addressbookService.list(() => {});

    return this.getWallets().then((wallets) => {
      this.calculateNetworkAmount(wallets);
      this.processEasyReceive();
      this.txpsData = this.profileService.getTxps({limit: 3});
      if (this.configService.get().recentTransactions.enabled) {
        this.recentTransactionsEnabled = true;
        this.recentTransactionsData = this.profileService.getNotifications({limit: 3});
      }
      return Promise.resolve();
    })
    .catch((err) => {
      console.log("@@ERROR IN Updating statuses.")
      console.log(err)
    });
  }

  private registerListeners() {



    this.events.subscribe('bwsEvent', (e, walletId, type, n) => {
      this.logger.info("Got a bwsEvent event with: ", walletId, type, n);
      
      this.txpsData = this.profileService.getTxps({limit: 3});
    });

    this.events.subscribe('Local:Tx:Broadcast', (broadcastedTxp) => {
      this.logger.info("Got a Local:Tx:Broadcast event with: ", broadcastedTxp);
      // this.getWallets().then((wallets) => {
      //   wallets.forEach((wallet) => {
      //     if (wallet.id == walletId) {
      //       updateWalletStatus(wallet);
      //     }
      //   });
      // });
    });

    this.events.subscribe('easyReceiveEvent', (e, receipt:EasyReceipt) => {
      let checkPass = receipt.checkPassword;
      this.showEasyReceiveModal(receipt, checkPass);
    });

  }


  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private processEasyReceive() {
    this.easyReceiveService.getPendingReceipt().then((receipt) => {
      if (receipt) {
        let checkPass = receipt.checkPassword;
        this.showEasyReceiveModal(receipt, checkPass);
      }
    });
  }

  private showEasyReceiveModal = (receipt:EasyReceipt, checkPassword:boolean) => {
    let inputs = checkPassword ?  [{name: 'password', placeholder: 'Enter password',type: 'password'}] : [];

    this.alertController.create({
      title: `You've got merit from ${receipt.senderName}!`,
      inputs: inputs,
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {
          this.logger.info('You have declined easy receive');
          this.rejectEasyReceipt(receipt);
        }
        },
        {text: "Ok", handler: (data) => {
          if (!data.password) {
            this.showEasyReceiveModal(receipt, checkPassword);
          } else {
            this.acceptEasyReceipt(receipt, data.password);
          }
        }}
      ]
    }).present();
  };

  private acceptEasyReceipt(receipt:EasyReceipt, password:string) {

    this.getWallets().then((wallets) => {

      let wallet = wallets[0];
      let forceNewAddress = false;
      this.walletService.getAddress(wallet, forceNewAddress).then((address) => {

        let input = 1;
        this.easyReceiveService.acceptEasyReceipt(receipt, wallet , input, address).catch((err) => {
          this.toastCtrl.create({
            message: err,
            cssClass: ToastConfig.CLASS_ERROR
          });
        })

      }).catch((err) => {
        this.toastCtrl.create({
          message: err,
          cssClass: ToastConfig.CLASS_ERROR
        });
      });

    });

  }

  private rejectEasyReceipt(receipt:EasyReceipt) {
    // todo reject
    this.easyReceiveService.rejectEasyReceipt(receipt);
  }

  private calculateNetworkAmount(wallets:Array<Wallet>) {
    this.totalAmount = 0;

    let coin = ''; //todo what to use here??
    this.totalAmountFormatted =  this.txFormatService.parseAmount(this.totalAmount, 'MRT');

    wallets.forEach((wallet) => {
      this.walletService.getWalletAnv(wallet).then((amount) => {

        let coin = ''; //todo what to use here??
        this.totalAmount += amount;
        this.totalAmountFormatted =  this.txFormatService.parseAmount(this.totalAmount, 'MRT');
      });

    });
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
  private async getWallets():Promise<Array<Wallet>> {
    this.logger.warn("getWallets() in wallets.ts");
    if (this.needWalletStatuses()) {
      this.wallets = await this.updateAllWallets();     
    }
    return this.wallets;
  }

  private async updateAllWallets() {
    this.logger.warn("updateAllWallets() in wallets.ts");    
    let wallets = await this.profileService.getWallets();
    // Get the statuses of all the wallets.
    return await Promise.all(_.map(wallets, async (wallet:any) => {
      wallet.status = await this.walletService.getStatus(wallet);
      return wallet; 
    })).catch((err) => {
      console.log("Error updating wallets");
      console.log(err);
    });
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
    this.navCtrl.push('TxDetailsView', {txId: tx.txid, tx: tx})
  }

}

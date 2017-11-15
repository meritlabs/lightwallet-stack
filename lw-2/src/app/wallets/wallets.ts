import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';
import { Wallet } from "./wallet.model";

import * as _ from "lodash";
import { Promise } from 'bluebird';
import { ProfileService } from "merit/core/profile.service";
import { FeedbackService } from "merit/feedback/feedback.service"
import { Feedback } from "merit/feedback/feedback.model"
import { AppUpdateService } from "merit/core/app-update.service";
import {ToastConfig} from "../core/toast.config";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import {ConfigService} from "merit/shared/config.service";

import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";
import {Logger} from "merit/core/logger";
import { WalletService } from "merit/wallets/wallet.service";
import {EasyReceipt} from "merit/easy-receive/easy-receipt.model";
import {TxFormatService} from "merit/transact/tx-format.service";
import {AddressbookService} from "merit/addressbook/addressbook.service";


/* 
  Using bluebird promises! 
  This gives us the ability to map over items and 
  engage in async requests.
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
    private addressbookService:AddressbookService
  ) {
  }

  private async getWallets():Promise<Array<Wallet>> {
    if (!this.wallets) {
      this.wallets = await this.updateAllWallets();
    }

    return this.wallets;
  }

  public async ionViewDidLoad() {


    this.registerListeners();

    this.getWallets().then((wallets) => {
      this.calculateNetworkAmount(wallets);
    });

    this.processEasyReceive();

    this.newReleaseExists = await this.appUpdateService.isUpdateAvailable();
    this.feedbackNeeded   = await this.feedbackService.isFeedBackNeeded();

    this.addressbook = await this.addressbookService.list();

    this.txpsData = await this.profileService.getTxps({limit: 3});
    if (this.configService.get().recentTransactions.enabled) {
      this.recentTransactionsEnabled = true;
      this.recentTransactionsData = this.profileService.getNotifications({limit: 3});
    }

  }

  private registerListeners() {

    let updateWalletStatus = (wallet) => {
      this.walletService.getStatus(wallet, {}).then((status) => {
        wallet.status = status;
      });
    };

    this.events.subscribe('bwsEvent', (e, walletId, type, n) => {
      this.getWallets().then((wallets) => {
        wallets.forEach((wallet) => {
          if (wallet.id == walletId) {
            updateWalletStatus(wallet);
          }
        });
      });
      this.txpsData = this.profileService.getTxps({limit: 3});
    });

    this.events.subscribe('Local/TxAction', (e, walletId) => {
      this.getWallets().then((wallets) => {
        wallets.forEach((wallet) => {
          if (wallet.id == walletId) {
            updateWalletStatus(wallet);
          }
        });
      });
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
    this.totalAmountFormatted =  this.txFormatService.parseAmount(coin, this.totalAmount, 'micros');

    wallets.forEach((wallet) => {
      this.walletService.getWalletAnv(wallet).then((amount) => {

        let coin = ''; //todo what to use here??
        this.totalAmount += amount;
        this.totalAmountFormatted =  this.txFormatService.parseAmount(coin, this.totalAmount, 'micros');
      });

    });
  }


  openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersView')
    } else {
      this.navCtrl.push('WalletDetailsView', {walletId: wallet.id, wallet: wallet});
    }
  }

  rateApp(mark) {
    this.feedbackData.mark = mark;
  }

  cancelFeedback() {
    this.feedbackData.mark = null;
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
    this.navCtrl.push('CreateWalletView');
  }

  toImportWallet() {
    this.navCtrl.push('ImportView');
  }

  private async updateAllWallets() {
    let wallets = await this.profileService.getWallets();
    return await Promise.all(_.map(wallets, async (wallet) => {
      wallet.status = await this.walletService.getStatus(wallet);
      return wallet;
    }));

  }

  openTransactionDetails(transaction) {
    this.navCtrl.push('TransactionView', {transaction: transaction});
  }

  toTxpDetails() {
    this.navCtrl.push('TxpView');
  }

  txpCreatedWithinPastDay(txp) {
    var createdOn= new Date(txp.createdOn*1000);
    return ((new Date()).getTime() - createdOn.getTime()) < (1000 * 60 * 60 * 24);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Wallet } from "./wallet.model";
import { ProfileService } from "merit/core/profile.service";
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from "merit/core/logger";
import * as _ from "lodash";
import { Promise } from 'bluebird';

/* 
  Using bluebird promises!
*/ 
@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {

  private totalAmount = 0;
  public totalAmountFormatted = '0 bits';

  public wallets:Array<Wallet> = [];
  public proposals = [];
  public transactions = [];

  //private navCtrl:NavController;

  constructor(
    public navParams: NavParams,
    private navCtrl:NavController,
    private app:App,
    private profileService:ProfileService,
    private walletService: WalletService,
    private logger: Logger
  ) {
    //this.navCtrl = app.getRootNavs()[0];
  }

  doRefresh(refresher) {
    refresher.complete();
  }

  ionViewDidLoad() {
    this.logger.warn("Updating all the wallets.");
    
    // TODO: Show loader?
    this.updateAllWallets();
    // .then((updatedWallets) => {
    //   this.logger.warn("Updated all the wallets.");
    //   this.wallets = updatedWallets;
    // }).catch((err) => {
    //   this.logger.warn("Could not update wallets");
    //   // TODO: Throw a toast?  
    // }); 
  }

  openWallet(wallet) {
    if (!wallet.isComplete) {
      this.navCtrl.push('CopayersView')
    } else {
      this.navCtrl.push('WalletDetailsView', {walletId: wallet.id, wallet: wallet});
    }
  }

  toAddWallet() {
    this.navCtrl.push('CreateWalletView');
  }

  toImportWallet() {
    this.navCtrl.push('ImportView');
  }

  private updateAllWallets(): void {
    //return new Promise((resolve, reject) => {
      let wallets = this.profileService.getWallets();
      //var updatedWallets:Array<Wallet> = []; 

      Promise.map(wallets, (wallet) => {
        this.walletService.getStatus(wallet).then((status) => {
          wallet.status = status;
        });
        return wallet;
      }, {concurrency: 3}).then((upstatuses) => {
        console.log("Let's update the wallets with: ");
        console.log(upstatuses);
        this.wallets = upstatuses;
      }, (updatedWallets) => {
        console.log("I think we got an error: ");
        console.log(updatedWallets);
      }).catch((err) => {
        console.log("Bamboozled!!");
        console.log(err);
      });

      // this.logger.warn("Just got wallets");
      // this.logger.warn(wallets);
      // _.forOwn(wallets, (wallet, walletId) => {
      //   this.logger.warn("Learn you some JS");
      //   this.logger.warn(wallet);
      //   this.logger.warn(walletId);
      //   this.walletService.getStatus(wallet).then((status) => {
      //     wallet.status = status || "donkey";
      //     updatedWallets.push(wallet);
      //     this.logger.warn("Dirty status: ");
      //     this.logger.warn(status);
      //   }).catch((err) => {
      //     this.logger.warn("Could not update all wallets!");
      //     reject(err);
      //   }).then((status) => {
      //     this.logger.warn("Dirty status: ");
      //     this.logger.warn(status);
      //     });
      // });
      // this.logger.warn("Wallets AfterStatus: ");
      // this.logger.warn(updatedWallets);
      // resolve(updatedWallets);
    //})
  }


}

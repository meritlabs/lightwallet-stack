import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Wallet } from "./wallet.model";
import { ProfileService } from "merit/core/profile.service";
import { WalletService } from "merit/wallets/wallet.service";
import * as _ from "lodash";

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
    private walletService: WalletService
  ) {
    //this.navCtrl = app.getRootNavs()[0];
  }

  doRefresh(refresher) {
    refresher.complete();
  }

  ionViewDidLoad() {
    console.log("Updating all the wallets.");
    
    // TODO: Show loader?
    this.updateAllWallets().then((updatedWallets) => {
      console.log("Updated all the wallets.");
      this.wallets = updatedWallets;
    }).catch((err) => {
      console.log("Could not update wallets");
      // TODO: Throw a toast?  
    }); 
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

  private updateAllWallets(): Promise<Array<Wallet>> {
    return new Promise((resolve, reject) => {
      let wallets = this.profileService.getWallets();
      console.log("Just got wallets");
      console.log(wallets);
      _.each(wallets, (wallet) => {
        this.walletService.getStatus(wallet).then((status) => {
          wallet.status = status;
        }).catch((err) => {
          console.log("Could not update all wallets!");
          reject(err);
        });
      });
      resolve(wallets);
    })
  }


}

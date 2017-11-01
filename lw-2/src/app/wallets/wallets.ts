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
  This gives us the ability to map over items and 
  engage in async requests.
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

  async ionViewDidLoad() {    
    // TODO: Show loader?
    this.wallets = await this.updateAllWallets();
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

  private async updateAllWallets() {
    let wallets = await this.profileService.getWallets();
    return await Promise.all(_.map(wallets, async (wallet) => {
      wallet.status = await this.walletService.getStatus(wallet);  
      return wallet;
    }));

  }


}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { Logger } from 'merit/core/logger';


@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'wallet-details-view',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {

  public wallet:MeritWalletClient;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public walletService: WalletService,
    private logger:Logger  
  ) {
    // We can assume that the wallet data has already been fetched and 
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.wallet = this.navParams.get('wallet');
    console.log("Inside the wallet-details view.");
    console.log(this.wallet);
  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
    this.getWalletHistory();
  }

  ionViewDidLoad() {
    console.log("Wallet-Detail View Did Load.");
    console.log(this.wallet);
    //do something here
  }

  goToBackup() {
    console.log('not implemented yet');
  }

  private getWalletHistory(force: boolean = false ): void {
    this.logger.warn("GEtting history)");
    this.walletService.getTxHistory(this.wallet, {force: force}).then((walletHistory) => {
      this.wallet.completeHistory = walletHistory;
      this.logger.warn("@@@@");
      this.logger.warn(this.wallet.completeHistory);
    }).catch((err) => {
      console.log(err);
    });
  }

  private goToTxDetails(tx: any) {
    this.navCtrl.push('TxDetailsView', {walletId: this.wallet.credentials.walletId, txid: tx.txid});
  }
}

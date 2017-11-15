import { Component } from "@angular/core";
import { NavParams } from 'ionic-angular';
import { TxFormatService } from "merit/transact/tx-format.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { Logger } from "merit/core/logger";

@Component({
  selector: 'tx-details-view',
  templateUrl: 'tx-details.html'
})
export class TxDetailsPage {
  public title: string;
  public wallet: any;
  public tx: any;
  public confirmations: string;
  
  constructor(
    private navParams: NavParams,
    private txFormatService: TxFormatService,
    private walletService: WalletService,
    private profileService: ProfileService,
    private logger:Logger 
  ) {
    this.wallet = this.walletService.getWallet(this.navParams.data.walletId);
    this.tx = {};
    this.confirmations = null;
  }

  ionViewDidEnter() {
    const txid = this.navParams.data.txid;

    this.walletService.getTx(this.wallet, txid).then((tx) => {
      this.tx = tx;
      if (this.tx.action == 'sent') this.title = 'Sent Funds';
      if (this.tx.action == 'received') this.title = 'Received Funds';
      if (this.tx.action == 'moved') this.title = 'Moved Funds';

      if (this.tx.safeConfirmed) this.confirmations = this.tx.safeConfirmed;
      else if (this.tx.confirmations > 6)  this.confirmations = '6+';
    }).catch((err) => {
      console.log(err);
    });
  }

  addMemo() {
    return;
  }

  private viewOnBlockchain() {
    this.logger.warn("Viewing on blockchain is not yet implemented and up for discussion.")
  }

}
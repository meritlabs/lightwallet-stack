import { Component } from "@angular/core";
import { IonicPage, NavParams } from 'ionic-angular';
import { TxFormatService } from "merit/transact/tx-format.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { Logger } from "merit/core/logger";

const CONFIRMATION_THRESHOLD = 6;

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'tx-details-view',
  templateUrl: 'tx-details.html'
})
export class TxDetailsView {
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
    this.wallet = this.walletService.getWallet(this.navParams.get('walletId'));
    this.tx = {};
    this.confirmations = null;
  }

  ionViewDidEnter() {
    const txId = this.navParams.get('txId');

    this.walletService.getTx(this.wallet, txId).then((tx) => {
      this.tx = tx;
      if (this.tx.action == 'sent') this.title = 'Sent Funds';
      if (this.tx.action == 'received') this.title = 'Received Funds';
      if (this.tx.action == 'moved') this.title = 'Moved Funds';

      if (this.tx.safeConfirmed) this.confirmations = this.tx.safeConfirmed;
      else if (this.tx.confirmations > CONFIRMATION_THRESHOLD)  this.confirmations = `${CONFIRMATION_THRESHOLD}+`;
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
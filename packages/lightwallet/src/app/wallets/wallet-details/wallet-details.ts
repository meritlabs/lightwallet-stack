import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { Logger } from 'merit/core/logger';

import * as _ from 'lodash';


@IonicPage({
  segment: 'wallet/:walletId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'wallet-details-view',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsView {

  public wallet: MeritWalletClient;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public walletService: WalletService,
    private logger: Logger
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.wallet = this.navParams.get('wallet');
    this.logger.info("Inside the wallet-details view.");
  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
    this.getWalletHistory();
  }

  ionViewDidLoad() {
    //do something here
  }

  goToBackup() {
    this.logger.info('not implemented yet');
  }

  private getWalletHistory(force: boolean = false): void {
    this.walletService.getTxHistory(this.wallet, { force: force }).then((walletHistory) => {
      this.wallet.completeHistory = this.formatWalletHistory(walletHistory);
    }).catch((err) => {
      this.logger.info(err);
    });
  }

  private formatWalletHistory(wh: any[]): any[] {
    if (!_.isEmpty(wh)) {
      return _.map(wh, (h: any) => {
        if (!_.isNil(h) && !_.isNil(h.action)) {
          switch (h.action) {
            case 'sent':
              if (h.confirmations == 0) {
                h.actionStr = 'Sending Payment...';
              } else {
                h.actionStr = 'Payment Sent';
              }
              break;
            case 'received':
              if (h.confirmations == 0) {
                h.actionStr = 'Receiving Payment...';
              } else {
                h.actionStr = 'Payment Received';
              }
              break;
            case 'moved':
              h.actionStr = 'Moved Merit';
              break;
            default:
              h.actionStr = 'Recent Transaction';
              break
          }
        }
        return h;
      });
    } else {
      return [];
    }
  }

  // Belt and suspenders check to be sure that the total number of TXs on the page
  // add up to the total balance in status.
  private txHistoryInSyncWithStatus(): boolean {
    return true;
  }

  private goToTxDetails(tx: any) {
    this.navCtrl.push('TxDetailsView', { walletId: this.wallet.credentials.walletId, txId: tx.txid });
  }

  goToEditWallet() {
    this.navCtrl.push('EditWalletView', { wallet: this.wallet });
  }
}

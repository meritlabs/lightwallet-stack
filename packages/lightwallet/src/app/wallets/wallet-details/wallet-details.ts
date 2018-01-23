import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { formatWalletHistory } from '../../../utils/transactions';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public walletService: WalletService,
              private logger: Logger) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.wallet = this.navParams.get('wallet');
    this.logger.info('Inside the wallet-details view.');
  }

  deposit() {
  }

  send() {
  }

  ngOnInit() {
    this.getWalletHistory();
  }

  goToEditWallet() {
    this.navCtrl.push('EditWalletView', { wallet: this.wallet });
  }

  // Belt and suspenders check to be sure that the total number of TXs on the page

  private async getWalletHistory(force: boolean = false) {
    try {
      this.wallet.completeHistory = formatWalletHistory(await this.walletService.getTxHistory(this.wallet, { force: force }), this.wallet);
    } catch (err) {
      this.logger.info(err);
    }
  }
}

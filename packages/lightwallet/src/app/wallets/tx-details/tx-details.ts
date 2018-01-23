import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { RateService } from 'merit/transact/rate.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { WalletService } from 'merit/wallets/wallet.service';

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
  public vault: any;
  public amountStr: string;
  private bitcore: any;
  private txId: string;



  constructor(private navParams: NavParams,
              private txFormatService: TxFormatService,
              private walletService: WalletService,
              private vaultService: VaultsService,
              private profileService: ProfileService,
              private logger: Logger,
              private bws: BwcService,
              private rateService: RateService,
              private loadingCtrl: LoadingController) {
    this.tx = this.navParams.get('tx');

    // this.wallet = this.walletService.getWallet(this.navParams.get('walletId'));
    // this.vault = this.navParams.get('vault');
    // this.txId = this.navParams.get('txId');
    //
    // this.bitcore = this.bws.getBitcore();
    //
    // this.tx = {};
    // this.confirmations = null;
  }

  async ngOnInit() {
    this.updateTxDetails(this.tx);
    // const loading = this.loadingCtrl.create({
    //   content: 'Loading transaction...'
    // });
    // loading.present();

    // const vault = this.navParams.get('vault');
    //
    // if (vault) {
    //   const txs = await this.vaultService.getVaultTxHistory(this.wallet, vault);
    //   const tx = _.find(txs, {
    //     txid: this.txId
    //   });
    //
    //   if (!tx) throw new Error('Could not get transaction');
    //
    //   this.updateTxDetails(this.processTx(tx));
    // } else {
    //   try {
    //     const tx = await this.walletService.getTx(this.wallet, this.txId);
    //     this.updateTxDetails(tx);
    //   } catch (err) {
    //     this.logger.info(err);
    //   }
    // }

    // loading.dismiss();
  }

  addMemo() {
    return;
  }

  public isNotConfirmed(tx: any): boolean {
    return (tx.isCoinbase && !tx.isMature) || tx.confirmations < 1;
  }

  private viewOnBlockchain() {
    this.logger.warn('Viewing on blockchain is not yet implemented and up for discussion.')
  }

  private processTx(tx: any): any {
    const thisAddr = new this.bitcore.Address(this.vault.address).toString();
    const summ = _.reduce(tx.outputs, (acc: number, output: any) => {
      if (output.address != thisAddr) {
        return acc;
      }
      return acc + output.amount;
    }, 0);

    tx.amount = summ;
    const amountStr = this.txFormatService.formatAmountStr(summ);
    tx.amountStr = amountStr;
    this.amountStr = amountStr;
    tx.altAmount = this.rateService.fromMicrosToFiat(tx.amount, this.wallet.cachedStatus.alternativeIsoCode);
    tx.altAmountStr = new FiatAmount(tx.altAmount);

    return tx;
  }

  private updateTxDetails(tx: any): void {
    this.tx = tx;
    if (this.tx.action == 'sent') this.title = 'Sent Funds';
    if (this.tx.action == 'received') this.title = 'Received Funds';
    if (this.tx.action == 'moved') this.title = 'Moved Funds';

    if (this.tx.safeConfirmed) this.confirmations = this.tx.safeConfirmed;
    else if (this.tx.confirmations > CONFIRMATION_THRESHOLD) this.confirmations = `${CONFIRMATION_THRESHOLD}+`;
  }


}

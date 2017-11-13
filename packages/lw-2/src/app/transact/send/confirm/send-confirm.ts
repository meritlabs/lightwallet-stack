import { ConfigService } from './../../../shared/config.service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { NotificationService } from 'merit/shared/notification.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { PopupService } from 'merit/core/popup.service';
import { TransactionProposal } from 'merit/transact/transaction-proposal.model';
import { Wallet } from 'merit/wallets/wallet.model';
import { FeeService } from 'merit/shared/fee/fee.service';
import { FeeLevelModal } from 'merit/shared/fee/fee-level-modal';

import * as  _  from 'lodash';
import { Promise } from 'bluebird';

/**
 * The confirm view is the final step in the transaction sending process 
 * (for single-signature wallets).
 * TODO: 
 * - Simplify
 */
@IonicPage()
@Component({
  selector: 'send-confirm-view',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmView {

  // Statics
  private static CONFIRM_LIMIT_USD = 20;
  private static FEE_TOO_HIGH_LIMIT_PER = 15;

  private txData: {
    toAddress: any,
    toAmount: number,
    toName: string, 
    description?: string, 
    recipientType?: any, 
    toEmail?: string, 
    toPhoneNumber?: string,
    txp: any,
    allowSpendUnconfirmed: boolean,
    usingCustomFee: boolean
  };
  private wallet: Wallet;
  private walletSettings: any;
  private unitToMicro: number;
  private unitDecimals: number;
  private microToUnit: number;
  private configFeeLevel: string;
  private showAddress: Boolean = true;

  constructor(
    private configService: ConfigService,
    private navCtrl: NavController, 
    private navParams: NavParams,
    private logger: Logger,
    private feeService: FeeService,
    private walletService: WalletService,
    private txFormatService: TxFormatService,
    private popupService: PopupService,
    private modalCtrl: ModalController,
    private notificationService: NotificationService
  ) { 
    console.log("Hello SendConfirm View");
  }

  ionViewDidLoad() {
    this.logger.log('ionViewDidLoad ConfirmView');
    this.logger.log('Params', this.navParams);
    let toAmount = this.navParams.get('toAmount');
    this.walletSettings = this.configService.get().wallet.settings;
    this.wallet = this.navParams.get('wallet');
    this.unitToMicro = this.walletSettings.unitToMicro;
    this.unitDecimals = this.walletSettings.unitDecimals;
    this.microToUnit = 1 / this.unitToMicro;
    this.configFeeLevel = this.walletSettings.feeLevel ? this.walletSettings.feeLevel : 'normal';

    this.txData = {
      toAddress:  this.navParams.get('toAddress'),
      txp: {},
      toName: this.navParams.get('toAddress') || '',
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
      allowSpendUnconfirmed: this.walletSettings.spendUnconfirmed
    }

    this.updateTx(this.txData, this.wallet, {}).catch((err) => {
      this.logger.error('There was an error in updateTx:', err);
    });
    this.logger.log('ionViewDidLoad send-confirm', this);
  }

  // Show as much as we can about the address. 
  public displayName(): string {
    if (this.txData.toName) {
      return this.txData.toName;
    }
    // TODO: Check AddressBook
    return this.txData.toAddress || "no one";
  }

  // TODO: implement
  private refresh(): void {}

  private updateTx(tx, wallet, opts): Promise<void> {
    this.logger.log('updateTx called', tx, wallet);

    if (opts.clearCache) {
      tx.txp = {};
    }

    let updateAmount = () => {
      if (!tx.toAmount) return;

      // Amount
      tx.amountStr = this.txFormatService.formatAmountStr(tx.toAmount);
      tx.amountValueStr = tx.amountStr.split(' ')[0];
      tx.amountUnitStr = tx.amountStr.split(' ')[1];
      this.txFormatService.formatAlternativeStr(tx.toAmount).then((v) => {
        tx.alternativeAmountStr = v;
      });
    }

    updateAmount();
    this.refresh();

    // End of quick refresh, before wallet is selected.
    if (!wallet) return Promise.resolve();

    return this.feeService.getFeeRate(wallet.network, this.configFeeLevel).then((feeRate) => {

      if (tx.usingCustomFee) tx.feeRate = feeRate;
      tx.feeLevelName = this.feeService.feeOpts[tx.feeLevel];

      if (!wallet) return;

      // txp already generated for this wallet?
      if (tx.txp) {
        this.refresh();
        return;
      }

      return this.getTxp(_.clone(tx), wallet, opts.dryRun);
    }).tap((txpOut) => {
      console.log("Who are you txpOut?")
      console.log(txpOut)
      return txpOut
    }).then((txpOut) => {

      txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
      this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
        txpOut.alternativeFeeStr = v;
      });

      let per = (txpOut.fee / (txpOut.toAmount + txpOut.fee) * 100);
      txpOut.feeRatePerStr = per.toFixed(2) + '%';
      txpOut.feeToHigh = per > SendConfirmView.FEE_TOO_HIGH_LIMIT_PER;

      tx.txp = txpOut;
      this.txData = tx;

      this.logger.log('Confirm. TX Fully Updated for wallet:' + wallet.id, tx);
      this.refresh();
      return;
    });
  }

  private approveTx(tx, wallet): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!tx || !wallet) {
        this.logger.warn("No transaction or wallet data in approval.");
        return resolve(false);
      } 

      return this.getTxp(tx, wallet, false).then((ctxp) => {

        let confirmTx = (cb) => {
          if (this.walletService.isEncrypted(wallet))
            return cb();
  
          var amountUsd = parseFloat(this.txFormatService.formatToUSD(ctxp.toAmount));
          if (amountUsd <= SendConfirmView.CONFIRM_LIMIT_USD)
            return cb();
  
          var message = 'Sending {{tx.amountStr}} from your {{wallet.name}} wallet';
          var okText = 'Confirm';
          var cancelText = 'Cancel';
          this.popupService.ionicConfirm(null, message, okText, cancelText);
        };
  
        let publishAndSign = (): Promise<any> => {
          
          if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
            this.logger.info('No signing proposal: No private key');
  
            // TODO: custom status handler?
            return this.walletService.onlyPublish(wallet, ctxp, _.noop);
          }
  
          // TODO: custom status handler?
          return this.walletService.publishAndSign(wallet, ctxp, _.noop).then(() => {
            this.notificationService.subscribe(wallet, ctxp);
          });
        };
      });
    });
  }
  
  /** 
   * Returns a promises of a TXP. 
   * TODO: TxP type should be created.
   */
  private getTxp(tx, wallet, dryRun): Promise<any> {
    return new Promise((resolve, reject) => {
        // ToDo: use a credential's (or fc's) function for this
        if (tx.description && !wallet.credentials.sharedEncryptingKey) {
          return reject('Need a shared encryption key to add message!');
        }
    
        if (tx.toAmount > Number.MAX_SAFE_INTEGER) {
          return reject("The amount is too big.  Because, Javascript.");
        }
    
        let txp:any = {};
    
        if (tx.script) {
          txp.outputs = [{
            'script': tx.script.toHex(),
            'toAddress': tx.toAddress,
            'amount': tx.toAmount,
            'message': tx.description
          }];
          txp.addressType = 'P2SH';
          console.log(tx);
        } else {
          txp.outputs = [{
            'toAddress': tx.toAddress,
            'amount': tx.toAmount,
            'message': tx.description
          }];
        }
    
        if (tx.sendMaxInfo) {
          txp.inputs = tx.sendMaxInfo.inputs;
          txp.fee = tx.sendMaxInfo.fee;
        } else {
          if (this.txData.usingCustomFee) {
            txp.feePerKb = tx.feeRate;
          } else txp.feeLevel = tx.feeLevel;
        }
    
        txp.message = tx.description;
    
        if (tx.paypro) {
          txp.payProUrl = tx.paypro.url;
        }
        txp.excludeUnconfirmedUtxos = !tx.spendUnconfirmed;
        txp.dryRun = dryRun;
        return resolve(this.walletService.createTx(wallet, txp));
    });
  }

  chooseFeeLevel(tx, wallet) {
    
    let scope: any = {};
    scope.network = tx.network;
    scope.feeLevel = tx.feeLevel;
    scope.noSave = true;

    if (this.txData.usingCustomFee) {
      scope.customFeePerKB = tx.feeRate;
      scope.feePerMicrosByte = tx.feeRate / 1000;
    }

    let feeLevelModel = this.modalCtrl.create(FeeLevelModal, scope, {
      enableBackdropDismiss: false
    })
    feeLevelModel.onDidDismiss((selectedFeeData) => {
      this.logger.debug('New fee level choosen:' + selectedFeeData.selectedFee + ' was:' + tx.feeLevel);
      this.txData.usingCustomFee = selectedFeeData.selectedFee == 'custom' ? true : false;
      if (tx.feeLevel == selectedFeeData.selectedFee && !this.txData.usingCustomFee) return;
      tx.feeLevel = selectedFeeData.selectedFee;
      if (this.txData.usingCustomFee) tx.feeRate = parseInt(selectedFeeData.customFeePerKB);

      this.updateTx(tx, wallet, {
        clearCache: true,
        dryRun: true
      }).then(() => {});
    })
    feeLevelModel.present();
  };
  public toggleAddress() {
    this.showAddress = !this.showAddress;
  };

}

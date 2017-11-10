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
import { FeeLevelModal } from 'merit/shared/fee/fee-level';

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

  private txp: TransactionProposal = new TransactionProposal; // Transaction proposal
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
    this.logger.log('Params', this.navParams.data);
    this.txp = _.pick(this.navParams.data, [
      'toAddress',
      'amount',
      'description',
      'recipientType',
      'toName',
      'toEmail',
      'toPhoneNumber'
    ]);
    this.wallet = this.navParams.data.wallet;
    this.walletSettings = this.configService.get().wallet.settings;
    this.unitToMicro = this.walletSettings.unitToMicro;
    this.unitDecimals = this.walletSettings.unitDecimals;
    this.microToUnit = 1 / this.unitToMicro;
    this.configFeeLevel = this.walletSettings.feeLevel ? this.walletSettings.feeLevel : 'normal';
    this.txp.allowSpendUnconfirmed = this.walletSettings.spendUnconfirmed;

    this.updateTx(this.txp, this.wallet, {}).then(() => {
      // TODO: Handle easySend here
      this.logger.log('SendConfirmView updatedTx', this.txp)
    }).catch((err) => {
      this.logger.error('There was an error in updateTx:', err);
    });
  }

  // Show as much as we can about the address. 
  private displayName(): string {
    if (this.txp.toName) {
      return this.txp.toName;
    }
    // TODO: Check AddressBook
    return this.txp.toAddress || "no one";
  }

  // TODO: implement
  private refresh(): void {}

  private updateTx(tx, wallet, opts): Promise<void> {
    this.logger.log('updateTx called', tx, wallet);

    if (opts.clearCache) {
      tx.txp = {};
    }

    this.txp = tx;

    function updateAmount() {
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
      if (tx.txp[wallet.id]) {
        this.refresh();
        return;
      }

      return this.getTxp(_.clone(tx), wallet, opts.dryRun);
    }).then((txpOut) => {

      txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
      this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
        txpOut.alternativeFeeStr = v;
      });

      let per = (txpOut.fee / (txpOut.amount + txpOut.fee) * 100);
      txpOut.feeRatePerStr = per.toFixed(2) + '%';
      txpOut.feeToHigh = per > SendConfirmView.FEE_TOO_HIGH_LIMIT_PER;

      tx.txp[wallet.id] = txpOut;
      this.logger.debug('Confirm. TX Fully Updated for wallet:' + wallet.id, tx);
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

        function confirmTx(cb) {
          if (this.walletService.isEncrypted(wallet))
            return cb();
  
          var amountUsd = parseFloat(this.txFormatService.formatToUSD(ctxp.amount));
          if (amountUsd <= SendConfirmView.CONFIRM_LIMIT_USD)
            return cb();
  
          var message = 'Sending {{tx.amountStr}} from your {{wallet.name}} wallet';
          var okText = 'Confirm';
          var cancelText = 'Cancel';
          this.popupService.ionicConfirm(null, message, okText, cancelText);
        };
  
        function publishAndSign(): Promise<any> {
          
          if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
            this.logger.info('No signing proposal: No private key');
  
            return this.walletService.onlyPublish(wallet, ctxp);
          }
  
          return this.walletService.publishAndSign(wallet, ctxp).then(() => {
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
          if (this.txp.usingCustomFee) {
            txp.feePerKb = tx.feeRate;
          } else txp.feeLevel = tx.feeLevel;
        }
    
        txp.message = tx.description;
    
        if (tx.paypro) {
          txp.payProUrl = tx.paypro.url;
        }
        txp.excludeUnconfirmedUtxos = !tx.spendUnconfirmed;
        txp.dryRun = dryRun;
        return this.walletService.createTx(wallet, txp);
    });
  }

  chooseFeeLevel(tx, wallet) {
    
    let scope: any = {};
    scope.network = tx.network;
    scope.feeLevel = tx.feeLevel;
    scope.noSave = true;

    if (this.txp.usingCustomFee) {
      scope.customFeePerKB = tx.feeRate;
      scope.feePerMicrosByte = tx.feeRate / 1000;
    }

    let feeLevelModel = this.modalCtrl.create(FeeLevelModal, scope, {
      enableBackdropDismiss: false
    })
    feeLevelModel.onDidDismiss((selectedFeeData) => {
      this.logger.debug('New fee level choosen:' + selectedFeeData.selectedFee + ' was:' + tx.feeLevel);
      this.txp.usingCustomFee = selectedFeeData.selectedFee == 'custom' ? true : false;
      if (tx.feeLevel == selectedFeeData.selectedFee && !this.txp.usingCustomFee) return;
      tx.feeLevel = selectedFeeData.selectedFee;
      if (this.txp.usingCustomFee) tx.feeRate = parseInt(selectedFeeData.customFeePerKB);

      /*
      this.updateTx(tx, wallet, {
        clearCache: true,
        dryRun: true
      }, function() {});
      */
    })
    feeLevelModel.present();
  };
  public toggleAddress() {
    this.showAddress = !this.showAddress;
  };

}

import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { NotificationService } from 'merit/shared/notification.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { PopupService } from 'merit/core/popup.service';
import { TransactionProposal } from 'merit/transact/transaction-proposal.model';
import { Wallet } from 'merit/wallets/wallet.model';


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
  public static CONFIRM_LIMIT_USD = 20;
  private txp: TransactionProposal = new TransactionProposal; // Transaction proposal
  private wallet: Wallet;

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private logger: Logger,
    private walletService: WalletService,
    private txFormatService: TxFormatService,
    private popupService: PopupService,
    private notificationService: NotificationService    
  ) { 
    console.log("Hello SendConfirm View");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmView');
    console.log('Params', this.navParams.data);
    this.txp.toAddress = this.navParams.data.toAddress;
    this.txp.amount = this.navParams.data.amount;
    this.wallet = this.navParams.data.wallet;
  }

  // Show as much as we can about the address. 
  private displayName(): string {
    if (this.txp.toName) {
      return this.txp.toName;
    }
    // TODO: Check AddressBook
    return this.txp.toAddress || "no one";
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
  
          this.walletService.publishAndSign(wallet, ctxp).then(() => {
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

}

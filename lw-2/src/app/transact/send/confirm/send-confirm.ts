import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { NotificationService } from 'merit/shared/notification.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { PopupService } from 'merit/core/popup.service';
import { Transaction } from 'merit/transact/transaction.model';


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

  // Core Params
  private toAddress: string;
  private amount: string;
  private description: string;
  private sendMax: boolean;
  private feeLevel: any;
  private allowSpendUnconfirmed: boolean = true; // TODO: Consider removing entirely.

  // Vanity Params -- Not on the blockchain; but we use convenience and usability.
  private recipientType: any; // TODO: Define type
  private toName: string;
  private toEmail: string;
  private toPhoneNumber: string;
  private toColor: string;
  private usingCustomFee: boolean = false;

  // TODO: Utilize a type for TxProposals
  private txp: any; // Transaction proposal

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private logger: Logger,
    private walletService: WalletService,
    private txFormatService: TxFormatService,
    private popupService: PopupService,
    private notificationService: NotificationService    
  ) { 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmView');
    this.toAddress = this.navParams.data.toAddress;
    this.amount = this.navParams.data.amount;
  }

  // Show as much as we can about the address. 
  private displayName(): string {
    if (this.toName) {
      return this.toName;
    }
    // TODO: Check AddressBook
    return this.toAddress || "no one";
  }

  private approveTx(tx, wallet): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!tx || !wallet) {
        this.logger.warn("No transaction or wallet data in approval.");
        return resolve(false);
      } 

      this.getTxp(tx, wallet, false).then((ctxp) => {

        function confirmTx(cb) {
          if (this.walletService.isEncrypted(wallet))
            return cb();
  
          var amountUsd = parseFloat(this.txFormatService.formatToUSD(ctxp.amount));
          if (amountUsd <= CONFIRM_LIMIT_USD)
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
          if (this.usingCustomFee) {
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

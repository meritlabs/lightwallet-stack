import { ConfigService } from './../../../shared/config.service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { WalletService } from 'merit/wallets/wallet.service';
import { NotificationService } from 'merit/shared/notification.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { PopupService } from 'merit/core/popup.service';
import { ProfileService } from 'merit/core/profile.service';
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
    allowSpendUnconfirmed?: boolean,
    usingCustomFee?: boolean
  };
  private wallet: Wallet;
  private wallets: Array<Wallet>;
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
    private profileService: ProfileService,
    private logger: Logger,
    private feeService: FeeService,
    private walletService: WalletService,
    private txFormatService: TxFormatService,
    private popupService: PopupService,
    private modalCtrl: ModalController,
    private notificationService: NotificationService,
    private loadingCtrl: LoadingController
  ) { 
    console.log("Hello SendConfirm View");
  }

  async ionViewDidLoad() {
    this.wallets = await this.profileService.getWallets();
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

    this.logger.log('ionViewDidLoad send-confirm', this);
    return this.updateTx(this.txData, this.wallet, {dryRun: true}).catch((err) => {
      this.logger.error('There was an error in updateTx:', err);
    });
    
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
    this.logger.log('updateTx updated amount', tx, wallet);
    this.refresh();

    // End of quick refresh, before wallet is selected.
    if (!wallet) return Promise.resolve();

    this.logger.log('updateTx getting fee rate', tx, wallet);
    return this.feeService.getFeeRate(wallet.network, this.configFeeLevel).then((feeRate) => {

      this.logger.log('updateTx got a fee rate', tx, wallet);
      if (tx.usingCustomFee) tx.feeRate = feeRate;
      tx.feeLevelName = this.feeService.feeOpts[tx.feeLevel];

      if (!wallet) return Promise.resolve();

      this.logger.log('updateTx has a wallet', tx, wallet);
      // txp already generated for this wallet?
      if (!_.isEmpty(tx.txp)) {
        this.refresh();
        return Promise.resolve();
      }

      this.logger.log('updateTx getting a txp', tx, wallet);
      return this.getTxp(_.clone(tx), wallet, opts.dryRun).then((txpOut) => {
        console.log('getTxp got the response: ', txpOut);

          txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
          return this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
            txpOut.alternativeFeeStr = v;
          

          let per = (txpOut.fee / (txpOut.toAmount + txpOut.fee) * 100);
          txpOut.feeRatePerStr = per.toFixed(2) + '%';
          txpOut.feeToHigh = per > SendConfirmView.FEE_TOO_HIGH_LIMIT_PER;

          tx.txp = txpOut;
          this.txData = tx;

          console.log('Confirm. TX Fully Updated for wallet:' + wallet.id, tx);
          return Promise.resolve();
        }).catch((err) => {this.logger.warn("could it be the txFormat?", err)});
      }).catch((err) => {
        this.logger.warn("Error in getting a TXP!!", err);
        return Promise.resolve();
      });
    }).catch((err) => {
      this.logger.warn("Error after getting feeRate in UpdateTx", err);
      return Promise.resolve();
    });
  }

  public approve(): Promise<boolean> {
    let loadingSpinner = this.loadingCtrl.create({
      content: "Sending transaction...",
      dismissOnPageChange: true    });
    return loadingSpinner.present().then(() => {
      return this.approveTx(this.txData, this.wallet);
    }).then((worked) => {
      loadingSpinner.dismiss();
      this.navCtrl.push('WalletsView');
      return Promise.resolve(worked);
    }).catch((err) => {
      this.logger.warn("Failed to approve transaction.");
      this.logger.warn(err);
    });
  }

  private approveTx(tx, wallet): Promise<boolean> {
    this.logger.warn("Finally approving.");
    this.logger.warn(tx);
    return new Promise((resolve, reject) => {
      if (!tx || !wallet) {
        this.logger.warn("No transaction or wallet data in approval.");
        return resolve(false);
      } 

      return this.getTxp(_.clone(tx), wallet, false).then((ctxp) => {

        let confirmTx = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            if (this.walletService.isEncrypted(wallet))
              return resolve();
  
            let amountUsd: number;
            return this.txFormatService.formatToUSD(ctxp.amount).then((value: string) => {
              amountUsd = parseFloat(value);
           
    
              if (amountUsd <= SendConfirmView.CONFIRM_LIMIT_USD)
                return resolve();
    
              let amountStr = tx.amountStr;
              let name = wallet.name;
              let message = 'Sending ' + amountStr + ' from your ' + name + ' wallet'; // TODO gettextCatalog
              let okText = 'Confirm'; // TODO gettextCatalog
              let cancelText = 'Cancel'; // TODO gettextCatalog
              return this.popupService.ionicConfirm(null, message, okText, cancelText).then((ok: boolean) => {
                return resolve(ok);
              });
            });
          });
        };
  
        let publishAndSign = (): Promise<any> => {
          if (!wallet.canSign() && !wallet.isPrivKeyExternal()) {
            this.logger.info('No signing proposal: No private key');
            return Promise.resolve(this.walletService.onlyPublish(wallet, ctxp, _.noop));
          }
          return this.walletService.publishAndSign(wallet, ctxp, _.noop).then((txp: any) => {
            //return Promise.resolve(this.notificationService.subscribe(wallet, txp));
            this.logger.warn("We should have subscribed at this point in publishAndSign: ", txp);
            return Promise.resolve();
          });
        };

        return confirmTx().then((success: boolean) => {
          if (!success) {
            this.logger.warn("Error with confirming transaction.");
          }
          return publishAndSign().then(() => {
            return resolve(true);
          }).catch((err: any) => {
            this.logger.warn("Could not publishAndSign: ", err);
          });
        }).catch((err: any) => {
          this.logger.warn("Could not confirmTx: ", err);
        });
      }).catch((err) => {
        this.logger.warn("Never got the TXP!: ", err);        
      });
    });
  }
  
  /** 
   * Returns a promises of a TXP. 
   * TODO: TxP type should be created.
   */
  private getTxp(tx, wallet, dryRun): Promise<any> {
    this.logger.warn("In GetTXP");
    this.logger.warn(tx);
    this.logger.warn(wallet);
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
      return this.walletService.createTx(wallet, txp).then((ctxp) => {
        return resolve(ctxp);
      });
    });
  }

  private _chooseFeeLevel(tx, wallet) {
    
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

  private chooseFeeLevel(): void {
    this._chooseFeeLevel(this.txData, this.wallet);
  }

  private selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
    });
  }

  private showSendError(err: string = ''): any {
    this.popupService.ionicConfirm("Could not confirm transaction.", err, "Ok", "Cancel");    
  }

}

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
import { FeeService } from 'merit/shared/fee/fee.service';
import { FeeLevelModal } from 'merit/shared/fee/fee-level-modal';

import * as  _  from 'lodash';
import * as Promise from 'bluebird';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { easySendURL } from 'merit/transact/send/easy-send/easy-send.model';
import { MeritContact } from 'merit/shared/address-book/contact/contact.model';

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
  
  private recipient: MeritContact;
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
    usingCustomFee?: boolean,
    script?: any,
    easySendURL?: string
  };
  private wallet: MeritWalletClient;
  private walletConfig: any;
  private wallets: Array<MeritWalletClient>;
  private unitToMicro: number;
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
    private loadingCtrl: LoadingController,
    private easySendService: EasySendService
  ) { 
    this.logger.info("Hello SendConfirm View");
    this.walletConfig = this.configService.get().wallet;
    
  }

  async ionViewDidLoad() {
    this.wallets = await this.profileService.getWallets();
    let toAmount = this.navParams.get('toAmount');
    this.walletConfig = this.configService.get().wallet;
    this.wallet = this.navParams.get('wallet');
    this.unitToMicro = this.walletConfig.settings.unitToMicro;
    this.configFeeLevel = this.walletConfig.settings.feeLevel ? this.walletConfig.settings.feeLevel : 'normal';
    this.recipient = this.navParams.get('recipient');

    this.txData = {
      toAddress:  this.recipient.meritAddress,
      txp: {},
      toName: this.recipient.name || '',
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
      allowSpendUnconfirmed: this.walletConfig.spendUnconfirmed
    }

    if(this.recipient.sendMethod != 'address') {
      await this.updateEasySendData();
    }
    this.logger.log('ionViewDidLoad txData', this.txData);
    await this.updateTx(this.txData, this.wallet, {dryRun: true}).catch((err) => {
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

      if (!wallet) return Promise.resolve();

      // txp already generated for this wallet?
      if (!_.isEmpty(tx.txp)) {
        this.refresh();
        return Promise.resolve();
      }

      return this.getTxp(_.clone(tx), wallet, opts.dryRun).then((txpOut) => {

          txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
          return this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
            txpOut.alternativeFeeStr = v;
          

          let per = (txpOut.fee / (txpOut.toAmount + txpOut.fee) * 100);
          txpOut.feeRatePerStr = per.toFixed(2) + '%';
          txpOut.feeToHigh = per > SendConfirmView.FEE_TOO_HIGH_LIMIT_PER;

          tx.txp = txpOut;
          this.txData = tx;

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

  private updateEasySendData(): Promise<void> {
    return this.easySendService.createEasySendScriptHash(this.wallet).then((easySend) => {
      this.txData.script = easySend.script;
      this.txData.script.isOutput = true;
      this.txData.easySendURL = easySendURL(easySend);
      this.txData.toAddress = this.txData.script.toAddress().toString();
      return Promise.resolve();
    })
  }

  public approve(): Promise<void> {
    let loadingSpinner = this.loadingCtrl.create({
      content: "Sending transaction...",
      dismissOnPageChange: true
    });
    return Promise.resolve(loadingSpinner.present()).then((res) => {
      return this.approveTx(this.txData, this.wallet);
    }).then(() => {
      loadingSpinner.dismiss();
      switch (this.recipient.sendMethod) {
        case 'sms':
          return this.easySendService.sendSMS(this.recipient.phoneNumber, this.txData.easySendURL);
        case 'email':
          return this.easySendService.sendEmail(this.recipient.email, this.txData.easySendURL);
        default:
          return Promise.resolve();
          break;
      };
    }).then(() => {
      this.navCtrl.push('WalletsView');
    }).catch((err) => {
      this.logger.warn("Failed to approve transaction.");
      this.logger.warn(err);
      return Promise.reject(err);
    });
  }

  private approveTx(tx, wallet): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!tx || !wallet) {
        return reject(new Error("No transaction or wallet data in approval."));
      } 

      return this.getTxp(_.clone(tx), wallet, false).then((ctxp) => {

        let confirmTx = (): Promise<any> => {
            if (this.walletService.isEncrypted(wallet))
              return Promise.resolve(false);
  
            let amountUsd: number;
            return this.txFormatService.formatToUSD(ctxp.amount).then((value: string) => {
              amountUsd = parseFloat(value);
           
    
              if (amountUsd <= SendConfirmView.CONFIRM_LIMIT_USD)
                return Promise.resolve(false);
    
              let amountStr = tx.amountStr;
              let name = wallet.name;
              let message = 'Sending ' + amountStr + ' from your ' + name + ' wallet'; // TODO gettextCatalog
              let okText = 'Confirm'; // TODO gettextCatalog
              let cancelText = 'Cancel'; // TODO gettextCatalog
              return this.popupService.ionicConfirm(null, message, okText, cancelText).then((ok: boolean) => {
                return Promise.resolve(ok);
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
            return Promise.resolve();
          });
        };

        return confirmTx().then((success: boolean) => {
          if (!success) {
            this.logger.warn("Error with confirming transaction.");
          }
          return publishAndSign().then(() => {
            return resolve();
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

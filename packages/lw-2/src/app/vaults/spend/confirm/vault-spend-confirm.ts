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

@IonicPage({
  segment: 'vault/:vaultId/spend/confirm',
  defaultHistory: ['VaultSpendAmountView']
})
@Component({
  selector: 'vault-spend-confirm-view',
  templateUrl: 'vault-spend-confirm.html',
})
export class VaultSpendConfirmView {

    // Statics
    private static CONFIRM_LIMIT_USD = 20;
    private static FEE_TOO_HIGH_LIMIT_PER = 15;

  private recipient: any;
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
    senderPublicKey?: any,
    easySendSecret?: string
  };
  private wallet: MeritWalletClient;
  private vault: any;
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
    this.vault = this.navParams.get('vault');
    console.log('vault', this.vault);

    this.txData = {
      toAddress:  this.recipient.meritAddress,
      txp: {},
      toName: this.recipient.name || '',
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
      allowSpendUnconfirmed: this.walletConfig.spendUnconfirmed
    }

    this.logger.log('ionViewDidLoad txData', this.txData);
    
  }

  public displayName(): string {
    if (this.txData.toName) {
      return this.txData.toName;
    }
    // TODO: Check AddressBook
    return this.txData.toAddress || "no one";

    
  }

  public approve(): Promise<boolean> {
    let loadingSpinner = this.loadingCtrl.create({
      content: "Sending transaction...",
      dismissOnPageChange: true
    });
    return Promise.resolve(loadingSpinner.present()).then((res) => {
      return this.approveTx(this.txData, this.wallet);
    }).then((worked) => {
      loadingSpinner.dismiss();
      this.navCtrl.push('WalletsView');
      return Promise.resolve(worked);
    }).catch((err) => {
      this.logger.warn("Failed to approve transaction.");
      this.logger.warn(err);
      return Promise.reject(err);
    });
  }

  private approveTx(tx, wallet): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!tx || !wallet) {
        this.logger.warn("No transaction or wallet data in approval.");
        return resolve(false);
      } 

      return this.getTxp(_.clone(tx), wallet, false).then((ctxp) => {

        let confirmTx = (): Promise<any> => {
            if (this.walletService.isEncrypted(wallet))
              return Promise.resolve(false);
  
            let amountUsd: number;
            return this.txFormatService.formatToUSD(ctxp.amount).then((value: string) => {
              amountUsd = parseFloat(value);
           
    
              if (amountUsd <= VaultSpendConfirmView.CONFIRM_LIMIT_USD)
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

      // this.updateTx(tx, wallet, {
      //   clearCache: true,
      //   dryRun: true
      // }).then(() => {});
    })
    feeLevelModel.present();
  };
  
  public toggleAddress() {
    this.showAddress = !this.showAddress;
  };

  private chooseFeeLevel(): void {
    this._chooseFeeLevel(this.txData, this.wallet);
  }

  private showSendError(err: string = ''): any {
    this.popupService.ionicConfirm("Could not confirm transaction.", err, "Ok", "Cancel");
  }

}

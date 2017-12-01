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
  private coins: Array<any> = [];

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
    this.coins = this.navParams.get('coins');
    console.log('vault', this.vault);

    this.txData = {
      toAddress:  this.recipient.pubKey,
      txp: {},
      toName: this.recipient.name || '',
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
    }

    await this.prepareTx();
    
    this.logger.log('ionViewDidLoad txData', this.txData);
  }

  public displayName(): string {
    if (this.txData.toName) {
      return this.txData.toName;
    }
    return this.txData.toAddress || "no one";
  }

  public prepareTx(): Promise<any> {
    const amount = this.navParams.get('toAmount');
    console.log(this.wallet);
    const txp =  this.wallet.buildSpendVaultTx(this.vault, this.coins, '', amount, '', {});
    this.txData.txp = txp;
    return txp;
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
    return Promise.resolve(true);
  }

  private getTxp(tx, wallet, dryRun): Promise<any> {
    const amount = this.navParams.get('toAmount');
    return this.wallet.buildSpendVaultTx(this.vault, this.coins, '', amount, '', {});
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

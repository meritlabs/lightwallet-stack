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
import { BwcService } from 'merit/core/bwc.service';

import * as  _  from 'lodash';
import * as Promise from 'bluebird';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';


@IonicPage({
  segment: 'vault/:vaultId/deposit/confirm',
  defaultHistory: ['VaultDepositAmountView']
})
@Component({
  selector: 'vault-deposit-confirm-view',
  templateUrl: 'vault-deposit-confirm.html',
})
export class VaultDepositConfirmView {
  // Statics
  private static CONFIRM_LIMIT_USD = 20;
  private static FEE_TOO_HIGH_LIMIT_PER = 15;

  private recipient: any;
  private txData: any = null;
  private wallet: MeritWalletClient;
  private vault: any;
  private walletConfig: any;
  private wallets: Array<MeritWalletClient>;
  private unitToMicro: number;
  private configFeeLevel: string;
  private showAddress: Boolean = true;
  private coins: Array<any> = [];
  private bitcore: any;

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
    private easySendService: EasySendService,
    private bwc: BwcService,
  ) { 
    this.logger.info("Hello SendConfirm View");
    this.walletConfig = this.configService.get().wallet;
    this.bitcore = this.bwc.getBitcore();
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
      toAddress: new this.bitcore.Address(this.vault.address).toString(),
      txp: {},
      toName: this.vault.name || this.vault._id,
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
    }

    await this.updateAmount();

    this.logger.log('ionViewDidLoad txData', this.txData);
  }

  public displayName(): string {
    if (this.txData.toName) {
      return this.txData.toName;
    }
    return this.txData.toAddress || "no one";
  }

  private updateAmount(): any {
    if (!this.txData.toAmount) return;

    // Amount
    this.txData.amountStr = this.txFormatService.formatAmountStr(this.txData.toAmount);   
    this.txData.amountValueStr = this.txData.amountStr.split(' ')[0];
    this.txData.amountUnitStr = this.txData.amountStr.split(' ')[1];
    this.txFormatService.formatAlternativeStr(this.txData.toAmount).then((v) => {
      this.txData.alternativeAmountStr = v;
    });
  }

  private deposit() {
    //return this.spendVaultService.spendVault(this.vault, spendKey,  this.txData.toAmount, recepient.pubKey).then(() => {
      this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });    
    // });
  }

  public toggleAddress() {
    this.showAddress = !this.showAddress;
  };

  private selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      console.log(wallet);
      if (wallet) this.wallet = wallet;
    });
  }
}

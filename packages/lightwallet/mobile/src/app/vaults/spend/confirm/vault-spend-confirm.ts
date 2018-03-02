import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import * as  _ from 'lodash';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ConfigService } from '@merit/common/services/config.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { FeeService } from '@merit/common/services/fee.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { PopupService } from '@merit/common/services/popup.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { SpendVaultService } from '@merit/mobile/app/vaults/spend/vault-spend.service';

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

  private dummyFeeReplaceMeWithActualFeeDontBeADummyMerit: string;
  private dummyFeeReplaceMeWithActualFeeDontBeADummyUSD: string;
  private recipient: any;
  private txData: any = null;
  private wallet: MeritWalletClient;
  private vault: any;
  private walletConfig: any;
  private wallets: Array<MeritWalletClient>;
  private unitToMicro: number;
  private configFeeLevel: string;
  private showAddress: Boolean = true;
  private showMerit: boolean = true;
  private coins: Array<any> = [];
  private bitcore: any;

  constructor(private configService: ConfigService,
              private navCtrl: NavController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private logger: LoggerService,
              private feeService: FeeService,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private popupService: PopupService,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private easySendService: EasySendService,
              private bwc: MWCService,
              private spendVaultService: SpendVaultService) {
    this.logger.info('Hello SendConfirm View');
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
    this.coins = this.navParams.get('coins');
    console.log('vault', this.vault);

    this.txData = {
      toAddress: this.recipient.address,
      txp: {},
      toName: this.recipient.name || '',
      toAmount: toAmount * this.unitToMicro, // TODO: get the right number from amount page
    };

    await this.updateAmount();

    this.logger.log('ionViewDidLoad txData', this.txData);
  }

  public displayName(): string {
    if (this.txData.toName) {
      return this.txData.toName;
    }
    return this.txData.toAddress || 'no one';
  }

  public toggleCurrency(): void {
    this.showMerit = !this.showMerit;
  }

  public toggleAddress() {
    this.showAddress = !this.showAddress;
  };

  private updateAmount(): any {
    if (!this.txData.toAmount) return;

    // Amount
    this.dummyFeeReplaceMeWithActualFeeDontBeADummyMerit =
      this.txFormatService.formatAmountStr(this.wallet.getDefaultFee()).split(' ')[0];

    this.txData.amountStr = this.txFormatService.formatAmountStr(this.txData.toAmount);
    this.txData.amountValueStr = this.txData.amountStr.split(' ')[0];
    this.txData.amountUnitStr = this.txData.amountStr.split(' ')[1];

    this.txData.alternativeAmountStr = this.txFormatService.formatAlternativeStr(this.txData.toAmount);
    this.dummyFeeReplaceMeWithActualFeeDontBeADummyUSD = this.txFormatService.formatAlternativeStr(this.wallet.getDefaultFee());
  }

  private spend() {
    const network = this.vault.address.network;
    const spendKey = this.bitcore.HDPrivateKey.fromString(this.wallet.credentials.xPrivKey);

    //convert string address to hash buffers
    let whitelist = _.map(this.vault.whitelist, (w: string) => {
      return this.bitcore.Address(w).toBuffer();
    });

    this.vault.whitelist = whitelist;

    const recepient = this.navParams.get('recipient');

    return this.spendVaultService.spendVault(this.vault, spendKey, this.txData.toAmount, recepient.address).then(() => {
      return this.navCtrl.goToRoot({}).then(() => {
        return this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
      });
    });
  }

}

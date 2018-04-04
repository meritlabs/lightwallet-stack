import { Component, ElementRef, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ISendMethod, SendMethodType } from '@merit/common/models/send-method';
import { ConfigService } from '@merit/common/services/config.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { SendService } from '@merit/common/services/send.service';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'view-send-amount',
  templateUrl: 'send-amount.html'
})
export class SendAmountView {
  public recipient: MeritContact;
  public sendMethod: ISendMethod;

  public availableUnits: Array<{ type: string, name: string }>;
  public selectedCurrency: { type: string, name: string };

  public txData: any;
  public feeCalcError: string;
  public feeLoading: boolean;

  public amount = { micros: 0, mrt: 0, fiat: 0 };
  public formData = { amount: '', password: '', confirmPassword: '', nbBlocks: 1008, validTill: '' };

  public readonly CURRENCY_TYPE_MRT = 'mrt';
  public readonly CURRENCY_TYPE_FIAT = 'fiat';

  public readonly MINUTE_PER_BLOCK = 1;

  public availableAmountMicros: number = 0;

  public wallets: Array<any>;
  public selectedWallet: any;

  public suggestedAmounts = {};
  public lastAmount: string;

  public feePercent: number;
  public feeIncluded: boolean = false;
  public feeTogglerEnabled: boolean = true;
  private referralsToSign: Array<any>;


  private allowUnconfirmed: boolean = true;

  private loading: boolean = true;

  @ViewChild('amount') amountInput: ElementRef;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private configService: ConfigService,
              private rateService: RateService,
              private feeService: FeeService,
              private profileService: ProfileService,
              private txFormatService: TxFormatService,
              private modalCtrl: ModalController,
              private toastCtrl: MeritToastController,
              private alertCtrl: AlertController,
              private easySendService: EasySendService,
              private easyReceiveSerivce: EasyReceiveService,
              private walletService: WalletService,
              private loadingCtrl: LoadingController,
              private logger: LoggerService,
              private sendService: SendService) {
    this.recipient = this.navParams.get('contact');
    this.sendMethod = this.navParams.get('suggestedMethod');
    this.loading = true;
  }

  async ngOnInit() {
    this.availableUnits = [
      { type: this.CURRENCY_TYPE_MRT, name: this.configService.get().wallet.settings.unitCode.toUpperCase() }
    ];
    const rate = await this.rateService.getRate(this.configService.get().wallet.settings.alternativeIsoCode);
    if (rate > 0) {
      this.availableUnits.push({
        type: this.CURRENCY_TYPE_FIAT,
        name: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      });
    }
    this.selectedCurrency = this.availableUnits[0];
    let passedAmount = this.navParams.get('amount');
    if (passedAmount) this.formData.amount = String(this.rateService.microsToMrt(passedAmount));
    await this.updateAmount();

    // todo add smart common amounts receive
    this.suggestedAmounts[this.CURRENCY_TYPE_MRT] = ['5', '10', '100'];
    this.suggestedAmounts[this.CURRENCY_TYPE_FIAT] = ['5', '10', '100'];

    this.wallets = await this.profileService.getWallets();
    await this.chooseAppropriateWallet();
    this.loading = false;
  }

  private chooseAppropriateWallet() {
    if (this.wallets && this.wallets[0]) {

      this.selectedWallet = this.wallets[0];

      this.wallets.some((wallet) => {
        let amount = this.navParams.get('amount') || 0;
        if (wallet.balance.spendableAmount > amount) {
          this.selectedWallet = wallet;
          return true;
        }
      });
    }
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal',
      {
        selectedWallet: this.selectedWallet,
        availableWallets: this.wallets
      }, MERIT_MODAL_OPTS);
    modal.present();
    modal.onDidDismiss(async (wallet) => {
      if (wallet) {
        this.selectedWallet = wallet;
        if (wallet.balance.spendableAmount < this.amount.micros) {
          this.formData.amount = this.rateService.microsToMrt(wallet.balance.spendableAmount).toString();
          this.updateAmount();
        }
      }
      this.updateTxData();
    });
  }


  showFeeIncludedTooltip() {
    this.alertCtrl.create({
      title: 'Include fee',
      message: 'If you choose this option, amount size that recipient receives will be reduced by fee size. Otherwise fee will be charged from your balance',
      buttons: ['Got it']
    }).present();
  }

  async selectCurrency(currency) {
    if (currency.type != this.selectedCurrency.type) {
      this.selectedCurrency = currency;
      this.selectAmount(this.formData.amount);
      this.updateAmount();
      await this.updateTxData();
    }
  }

  async selectAmount(amount: string) {
    let micros: number;

    if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
      micros = this.rateService.mrtToMicro(parseFloat(amount));
    } else {
      micros = this.rateService.fromFiatToMicros(parseFloat(amount), this.availableUnits[1].name);
    }

    if (micros > this.selectedWallet.balance.spendableAmount) {
      micros = this.selectedWallet.balance.spendableAmount;
      if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
        this.formData.amount = String(this.rateService.microsToMrt(micros));
      } else {
        this.formData.amount = String(this.rateService.fromMicrosToFiat(micros, this.availableUnits[1].name));
      }
    } else {
      this.formData.amount = amount;
    }

    await this.updateAmount();
    return this.updateTxData();
  }

  amountKeypress(key) {
    if (key == 13) return this.amountInput['_native']['nativeElement'].blur();
  }

  focusInput() {
    this.amountInput['_native']['nativeElement'].focus();
  }

  async processAmount(value) {
    if (value != this.lastAmount) {
      this.lastAmount = value;
      await this.updateAmount();
      await this.updateTxData();
    }
  }

  private async updateAmount() {
    if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
      this.amount.mrt = parseFloat(this.formData.amount) || 0;
      this.amount.micros = this.rateService.mrtToMicro(this.amount.mrt);
      if (this.availableUnits[1]) {
        this.amount.fiat = await this.rateService.microsToFiat(this.amount.micros, this.availableUnits[1].name);
      }
    } else {
      this.amount.fiat = parseFloat(this.formData.amount) || 0;
      this.amount.micros = await this.rateService.fiatToMicros(this.amount.fiat, this.availableUnits[1].name);
      this.amount.mrt = this.rateService.microsToMrt(
        await this.rateService.fiatToMicros(this.amount.fiat, this.availableUnits[1].name)
      );
    }

    if (this.selectedWallet) {
      if (this.amount.micros == this.selectedWallet.balance.spendableAmount) {
        this.feeIncluded = true;
        this.feeTogglerEnabled = false;
      } else {
        this.feeTogglerEnabled = true;
      }
    }

    return this.amount;
  }

  public isSendAllowed() {
    return (
      this.amount.micros > 0
      && !_.isNil(this.txData)
      && !_.isNil(this.txData.txp)
    );
  }

  public getAmountClass() {
    let length = this.formData.amount.length;
    if (length < 6) return 'amount-big';
    if (length < 8) return 'amount-medium';
    if (length < 11) return 'amount-small';
    return 'amount-tiny';
  }

  public async toConfirm() {

    if (this.formData.password != this.formData.confirmPassword) {
      return this.toastCtrl.create({
        message: 'Passwords do not match',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } else {
      this.txData.password = this.formData.password;
    }

    let loadingSpinner = this.loadingCtrl.create({
      content: 'Preparing transaction...',
      dismissOnPageChange: true
    });
    loadingSpinner.present();
    try {
      this.txData.txp.amount += this.txData.easyFee;
      this.txData.txp = await this.sendService.finalizeTxp(this.txData.wallet, this.txData.txp, this.txData.feeIncluded);
      this.navCtrl.push('SendConfirmationView', { txData: this.txData, referralsToSign: this.referralsToSign });
    } catch (e) {
      this.logger.warn(e);
    } finally {
      loadingSpinner.dismiss();
    }

  }

  selectExpirationDate() {
    const modal = this.modalCtrl.create('SendValidTillView', { nbBlocks: this.formData.nbBlocks }, MERIT_MODAL_OPTS);
    modal.present();
    modal.onDidDismiss((nbBlocks) => {
      if (nbBlocks) this.formData.nbBlocks = nbBlocks;
      this.updateTxData();
    });
  }

  private updateTxData() {
    this.feeLoading = true;
    this.feeCalcError = null;
    this.feePercent = null;

    if (!this.amount.micros) {
      this.txData = null;
      this.feeLoading = false;
      return this.createTxpDebounce.cancel();
    } else if (this.amount.micros > this.selectedWallet.balance.spendableAmount) {
      this.feeCalcError = 'Amount is too big';
      this.txData = null;
      this.feeLoading = false;
      return this.createTxpDebounce.cancel();
    } else {

      this.txData = {
        txp: null,
        wallet: this.selectedWallet,
        amount: this.amount.micros,
        feeAmount: null,
        password: this.formData.password,
        totalAmount: this.amount.micros,
        recipient: this.recipient,
        sendMethod: this.sendMethod,
        feeIncluded: this.feeIncluded,
        timeout: this.formData.nbBlocks,
        easyFee: 0
      };

      this.createTxpDebounce();
    }
  }

  private createTxpDebounce = _.debounce(() => {
    this.createTxp();
  }, 1000);

  private async createTxp() {

    if (this.amount.micros == this.selectedWallet.balance.spendableAmount) this.feeIncluded = true;

    try {

      if (this.sendMethod.type == SendMethodType.Easy) {

        const easySend = await  this.easySendService.createEasySendScriptHash(this.txData.wallet, this.formData.password);
        this.txData.easySend = easySend;
        this.txData.txp = await this.easySendService.prepareTxp(this.txData.wallet, this.amount.micros, easySend);
        this.txData.easySendUrl = getEasySendURL(easySend);
        this.txData.referralsToSign = [easySend.scriptReferralOpts];

        if (!this.feeIncluded) { //if fee is included we pay also easyreceive tx, so recipient can have the exact amount that is displayed
          this.txData.easyFee = await this.feeService.getEasyReceiveFee();
        }

      } else {
        this.txData.txp = await this.sendService.prepareTxp(this.txData.wallet, this.amount.micros, this.sendMethod.value);
      }

    } catch (err) {
      this.txData.txp = null;
      this.logger.warn(err);
      if (err.message) this.feeCalcError = err.message;
      return this.toastCtrl.create({
        message: err.message || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } finally {
      this.feeLoading = false;
    }

  }

}

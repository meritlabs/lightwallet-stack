import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import * as _ from 'lodash';
import { ISendMethod, SendMethodType } from 'merit/transact/send/send-method.model';
import { ConfigService } from 'merit/shared/config.service';
import { RateService } from 'merit/transact/rate.service';
import { FeeService } from 'merit/shared/fee/fee.service';
import { ProfileService } from 'merit/core/profile.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { MeritToastController } from 'merit/core/toast.controller';
import { ToastConfig } from 'merit/core/toast.config';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { getEasySendURL } from 'merit/transact/send/easy-send/easy-send.model';
import { Logger } from 'merit/core/logger';
import { MERIT_MODAL_OPTS } from '../../../../utils/constants';
import { MeritContact } from '../../../../models/merit-contact';

@IonicPage()
@Component({
  selector: 'view-send-amount',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {
  public recipient: MeritContact;
  public sendMethod: ISendMethod;

  public availableUnits: Array<{ type: string, name: string }>;
  public selectedCurrency: { type: string, name: string };

  public txData: any;
  public feeCalcError: string;
  public feeLoading: boolean;

  public amount = { micros: 0, mrt: 0, mrtStr: '0.00', fiat: 0, fiatStr: '0.00' };
  public formData = { amount: '0.00', password: '', confirmPassword: '', nbBlocks: 1008, validTill: '' };

  public readonly CURRENCY_TYPE_MRT = 'mrt';
  public readonly CURRENCY_TYPE_FIAT = 'fiat';

  public readonly MINUTE_PER_BLOCK = 1;

  public availableAmountMicros: number = 0;

  public wallets: Array<any>;
  public selectedWallet: any;

  public knownFeeLevels: Array<{ level: string, nbBlocks: number, feePerKb: number }>;
  public selectedFeeLevel: string = 'normal';
  public selectedFee: any;

  public suggestedAmounts = {};
  public lastAmount: string;

  public feeIncluded: boolean;
  private referralsToSign: Array<any>;

  private allowUnconfirmed: boolean = true;

  private loading: boolean;

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
              private walletService: WalletService,
              private loadingCtrl: LoadingController,
              private logger: Logger) {
    this.recipient = this.navParams.get('contact');
    this.sendMethod = this.navParams.get('suggestedMethod');
    this.loading = true;
  }

  async ionViewDidLoad() {
    this.availableUnits = [
      { type: this.CURRENCY_TYPE_MRT, name: this.configService.get().wallet.settings.unitCode.toUpperCase() }
    ];
    if (this.rateService.getRate(this.configService.get().wallet.settings.alternativeIsoCode) > 0) {
      this.availableUnits.push({
        type: this.CURRENCY_TYPE_FIAT,
        name: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      });
    }
    this.selectedCurrency = this.availableUnits[0];
    let passedAmount = this.navParams.get('amount') || 0;
    this.formData.amount = String(this.rateService.microsToMrt(passedAmount));
    await this.updateAmount();

    // todo add smart common amounts receive
    this.suggestedAmounts[this.CURRENCY_TYPE_MRT] = ['5', '10', '100'];
    this.suggestedAmounts[this.CURRENCY_TYPE_FIAT] = ['5', '10', '100'];

    this.wallets = await this.profileService.getWallets();
    await this.chooseAppropriateWallet();
    this.knownFeeLevels = await this.feeService.getFeeLevels(this.selectedWallet.network);
    this.loading = false;
  }

  private chooseAppropriateWallet() {
    if (this.wallets && this.wallets[0]) {

      this.selectedWallet = this.wallets[0];

      this.wallets.some((wallet) => {
        let amount = this.navParams.get('amount') || 0;
        if (wallet.status && wallet.status.spendableAmount > amount) {
          this.selectedWallet = wallet;
          return true;
        }
      });

      if (!this.selectedWallet.status) {
        this.walletService.getStatus(this.selectedWallet, { force: true }).then((status) => {
          this.selectedWallet.status = status;
        });
      }
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
        wallet.status = await this.walletService.getStatus(this.selectedWallet, { force: true });
        this.selectedWallet = wallet;
      }
      this.updateTxData();
    });
  }

  selectFee() {
    if (!this.txData || !this.txData.txp) return;
    const modal = this.modalCtrl.create('SendFeeView',
      {
        feeLevels: this.txData.txp.availableFeeLevels,
        selectedFeeLevelName: this.selectedFeeLevel
      }, MERIT_MODAL_OPTS);
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.selectedFeeLevel = data.name;
        this.selectedFee = data;
        this.txData.txp.fee = data.micros;
      }
    });
  }

  showFeeIncludedTooltip() {
    this.alertCtrl.create({
      title: 'Include fee',
      message: 'If you choose this option, amount size that recipient receives will be reduced by fee size. Otherwise fee will be charged from your balance'
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
    let micros;

    if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
      micros = this.rateService.mrtToMicro(parseFloat(amount));
    } else {
      micros = this.rateService.fromFiatToMicros(parseFloat(amount), this.availableUnits[1].name);
    }

    if (micros > this.selectedWallet.status.spendableAmount) {
      micros = this.selectedWallet.status.spendableAmount;
      if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
        this.formData.amount = String(this.rateService.microsToMrt(micros));
      } else {
        this.formData.amount = String(this.rateService.fromMicrosToFiat(micros, this.availableUnits[1].name));
      }
    } else {
      this.formData.amount = amount;
    }

    this.formData.amount = String(Math.round(parseFloat(this.formData.amount) * 1e8) / 1e8);

    await this.updateAmount();
    await this.updateTxData();
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
        this.amount.fiat = this.rateService.fromMicrosToFiat(this.amount.micros, this.availableUnits[1].name);
      }
    } else {
      this.amount.fiat = parseFloat(this.formData.amount) || 0;
      this.amount.micros = this.rateService.fromFiatToMicros(this.amount.fiat, this.availableUnits[1].name);
      this.amount.mrt = this.rateService.fromFiatToMerit(this.amount.fiat, this.availableUnits[1].name);
    }
    this.amount.mrtStr = this.txFormatService.formatAmountStr(this.amount.micros) + ' MRT';
    this.amount.fiatStr = await this.txFormatService.formatAlternativeStr(this.amount.micros);

    if (this.selectedWallet && this.selectedWallet.status) {
      if (this.amount.micros == this.selectedWallet.status.spendableAmount) this.feeIncluded = true;
    }

    return this.amount;
  }

  public toggleFeeIncluded() {
    this.updateTxData();
  }

  public isSendAllowed() {
    return (
      this.amount.micros > 0
      && !_.isNil(this.txData)
      && !_.isNil(this.txData.txp)
    );
  }

  public toConfirm() {

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
    this.createTxp({ dryRun: false }).then(() => {
      loadingSpinner.dismiss();
      this.navCtrl.push('SendConfirmationView', { txData: this.txData, referralsToSign: this.referralsToSign });
    }).catch(() => {
      loadingSpinner.dismiss();
    });
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

    if (!this.amount.micros) {
      this.txData = null;
      this.feeLoading = false;
      return this.createTxpDebounce.cancel();
    } else if (this.amount.micros > this.selectedWallet.status.spendableAmount) {
      this.feeCalcError = 'Amount is too big';
      this.selectedFee = null;
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
        timeout: this.formData.nbBlocks
      };

      this.createTxpDebounce({ dryRun: true });
    }
  }

  private createTxpDebounce = _.debounce((opts: { dryRun: boolean }) => {
    this.createTxp(opts);
  }, 1000);

  private async createTxp(opts: { dryRun: boolean }) {

    try {
      let data: any = {
        toAddress: this.sendMethod.value,
        toName: this.txData.recipient.name || '',
        toAmount: parseInt(this.txData.amount),
        allowSpendUnconfirmed: this.allowUnconfirmed,
        feeLevel: this.selectedFeeLevel
      };

      if (this.amount.micros == this.selectedWallet.status.spendableAmount) {
        data.sendMax = true;
        data.toAmount = null;
        this.feeIncluded = true;
      }

      const easyData: any = await this.getEasyData();
      data = data || {};
      data = _.merge(data, _.pick(easyData, 'script', 'toAddress'));
      data.toAddress = easyData.scriptAddress || data.toAddress;

      const txpOut = await this.getTxp(_.clone(data), this.selectedWallet, opts.dryRun);
      this.txData.txp = txpOut;
      this.txData.easySend = easyData;
      this.txData.easySendUrl = easyData.url;
      this.referralsToSign = _.filter([easyData.scriptReferralOpts]);

      this.txData.txp.availableFeeLevels = [];
      this.knownFeeLevels.forEach((level) => {
        // todo IF EASY ADD  easySend.size*feeLevel.feePerKb !!!!!!
        let micros = Math.round(txpOut.estimatedSize * level.feePerKb / 1000);
        let mrt = Math.round(this.rateService.microsToMrt(micros) * 1000000000) / 1000000000;
        //todo add description map

        // todo check if micros
        let percent = this.feeIncluded ? (micros / (this.amount.micros) * 100) : (micros / (this.amount.micros + micros) * 100);
        let precision = 1;
        if (percent > 0) {
          while (percent * Math.pow(10, precision) < 1) {
            precision++;
          }
        }
        precision++; //showing two valued digits

        let fee = {
          description: level.level,
          name: level.level,
          minutes: level.nbBlocks * this.MINUTE_PER_BLOCK,
          micros: micros,
          mrt: mrt,
          feePerKb: level.feePerKb,
          percent: percent.toFixed(precision) + '%'
        };
        this.txData.txp.availableFeeLevels.push(fee);
        if (level.level == this.selectedFeeLevel) {
          this.selectedFee = fee;
          this.txData.txp.fee = fee.micros;
          this.txData.feeAmount = fee.micros;
        }
      });
      this.feeCalcError = null;
    } catch (err) {
      this.txData.txp = null;
      this.logger.warn(err);
      if (err.message) this.feeCalcError = err.message;
      this.selectedFee = null;
      return this.toastCtrl.create({
        message: err.message || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } finally {
      this.feeLoading = false;
    }


  }

  private getEasyData() {
    if (this.sendMethod.type != SendMethodType.Easy) {
      return Promise.resolve({});
    } else {
      return this.easySendService.createEasySendScriptHash(this.txData.wallet, this.formData.password).then((easySend) => {
        easySend.script.isOutput = true;

        return {
          script: easySend.script,
          scriptAddress: easySend.scriptAddress,
          scriptReferralOpts: easySend.scriptReferralOpts,
          url: getEasySendURL(easySend),
        };
      });
    }
  }

  private getTxp(tx, wallet, dryRun) {
    // ToDo: use a credential's (or fc's) function for this
    if (tx.description && !wallet.credentials.sharedEncryptingKey) {
      return Promise.reject(new Error('Need a shared encryption key to add message!'));
    }

    if (tx.toAmount > Number.MAX_SAFE_INTEGER) {
      return Promise.reject(new Error('The amount is too big')); //.  Because, Javascript.
    }

    let txp: any = {};

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

    txp.sendMax = tx.sendMax;
    if (tx.sendMaxInfo) {
      txp.inputs = tx.sendMaxInfo.inputs;
      txp.fee = tx.sendMaxInfo.fee;
    } else {
      if (this.txData.usingCustomFee) {
        txp.feePerKb = tx.feeRate;
      } else txp.feeLevel = tx.feeLevelName;
    }

    txp.message = tx.description;

    if (tx.paypro) {
      txp.payProUrl = tx.paypro.url;
    }
    txp.excludeUnconfirmedUtxos = !tx.allowSpendUnconfirmed;
    if (!dryRun) {
      txp.dryRun = dryRun;
      txp.fee = this.txData.feeAmount;
      txp.inputs = this.txData.txp.inputs;
      if (txp.sendMax || this.feeIncluded) {
        txp.sendMax = false; // removing senmax options because we are setting fee and amount values manually
        txp.outputs[0].amount = this.txData.amount - this.txData.feeAmount;
      } else {
        txp.outputs[0].amount = this.txData.amount;
      }
    }
    return this.walletService.createTx(wallet, txp);
  }


}

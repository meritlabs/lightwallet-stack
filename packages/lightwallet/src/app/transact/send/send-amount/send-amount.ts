import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import * as _ from 'lodash';
import { SendMethod } from 'merit/transact/send/send-method.model';
import { ConfigService } from "merit/shared/config.service";
import { RateService } from 'merit/transact/rate.service';
import { FeeService } from 'merit/shared/fee/fee.service'
import { ProfileService } from "merit/core/profile.service";
import { TxFormatService } from "merit/transact/tx-format.service";

import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { EasySend, easySendURL } from 'merit/transact/send/easy-send/easy-send.model'



@IonicPage()
@Component({
  selector: 'view-send-amount',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {

  public recipient:MeritContact;
  public sendMethod:SendMethod;

  public availableUnits:Array<{type:string, name:string}>;
  public selectedCurrency:{type:string, name:string};

  public txData:any;
  public feeCalcError:string;

  public amount:{micros: number, mrt:number, mrtStr:string, fiat:number, fiatStr:string};
  public formData = {amount: '0.00', password: '', confirmPassword: '', nbBlocks: 1008, validTill: ''};

  public readonly CURRENCY_TYPE_MRT = 'mrt';
  public readonly CURRENCY_TYPE_FIAT = 'fiat';
  public readonly AMOUNT_MAX = 'All';

  public availableAmountMicros:number = 0;

  public wallets:Array<any>;
  public selectedWallet:any;

  public knownFeeLevels:{name:string, nbBlocks:number};
  public selectedFeeLevel:string = 'normal';

  public commonAmounts = {};
  public lastAmount:string;

  public feeIncluded:boolean;
  private referralsToSign: Array<any>;

  private allowUnconfirmed:boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private configService: ConfigService,
    private rateService: RateService,
    private feeService: FeeService,
    private profileService: ProfileService,
    private txFormatService:TxFormatService,
    private modalCtrl: ModalController,
    private toastCtrl: MeritToastController,
    private alertCtrl: AlertController,
    private easySendService: EasySendService,
    private walletService: WalletService,
    private loadingCtrl: LoadingController
  ) {

  }

  async ionViewDidLoad() {
    this.recipient = this.navParams.get('contact');
    this.amount = this.navParams.get('amount');
    this.sendMethod = this.navParams.get('method');

    this.availableUnits = [
      {type: this.CURRENCY_TYPE_FIAT, name: this.configService.get().wallet.settings.unitCode.toUpperCase()},
      {type: this.CURRENCY_TYPE_MRT, name: this.configService.get().wallet.settings.unitCode.toUpperCase()},
    ];
    this.selectedCurrency = this.availableUnits[0];
    this.updateAmount();

    // todo add smart common amounts receive
    this.commonAmounts[this.CURRENCY_TYPE_MRT] =  ['5', '10', '100', this.AMOUNT_MAX];
    this.commonAmounts[this.CURRENCY_TYPE_FIAT] = ['5', '10', '100', this.AMOUNT_MAX];

    this.wallets = await this.profileService.getWallets();
    this.chooseAppropriateWallet();
    this.knownFeeLevels = await this.feeService.getFeeLevels(this.selectedWallet.network);

  }

  private chooseAppropriateWallet() {
    if (this.wallets && this.wallets[0]) {

      this.selectedWallet = this.wallets[0];

      this.wallets.some((wallet) => {
        let amount = this.navParams.get('amount') || 0;;
        if (wallet.status && wallet.status.spendableAmount > amount) {
          this.selectedWallet = wallet;
          return true;
        }
      });
    }
  }

  selectWallet() {
    let modal = this.modalCtrl.create('SendWalletView', {selectedWallet: this.selectedWallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.selectedWallet = wallet;
      this.updateTxData();
    });
  }

  selectFee() {
    let modal = this.modalCtrl.create('SendFeeView', {feeLevels: this.txData.txp.availableFeeLevels, selectedFeeLevelName: this.selectedFeeLevel});
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.selectedFeeLevel = data.name;
        this.txData.txp.selectedFee = data;
      }
    });
  }

  showFeeIncludedTooltip() {
    this.alertCtrl.create({
      title: 'Include fee',
      message: "If you choose this option, amount size that recipient receives will be reduced by fee size. Otherwise fee will be charged from your balance"
    }).present();
  }

  selectCurrency(currency) {
    if (currency.type != this.selectedCurrency.type) {
      this.selectedCurrency = currency;
      this.updateAmount();
      this.updateTxData();
    }
  }

  async selectAmount(amount) {

    let micros = 0;
    if (amount == this.AMOUNT_MAX) {
      micros = this.selectedWallet.status.spendableAmount;
    } else {
      if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
        micros = this.rateService.mrtToMicro(parseFloat(amount));
      } else {
        micros = this.rateService.fromFiatToMicros(parseFloat(amount), this.availableUnits[1].name);
      }
    }

    if (micros > this.selectedWallet.status.spendableAmount) {
      micros = this.selectedWallet.status.spendableAmount;
      if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
        this.formData.amount = this.txFormatService.formatAmountStr(this.rateService.microsToMrt(micros));
      } else {
        this.formData.amount =  await this.txFormatService.formatAlternativeStr(this.rateService.microsToMrt(micros));
      }
    } else {
      this.formData.amount = amount;
    }

    this.updateAmount();

  }

  processAmount(value) {
    if (value != this.lastAmount) {
      this.lastAmount = value;
      this.updateAmount();
      this.updateTxData();
    }
  }

  private async updateAmount() {
    if (this.selectedCurrency.type == this.CURRENCY_TYPE_MRT) {
      this.amount.mrt = parseFloat(this.formData.amount);
      this.amount.micros = this.rateService.mrtToMicro(this.amount.mrt);
      this.amount.fiat =  this.rateService.fromMicrosToFiat(this.amount.micros, this.availableUnits[1].name);
    } else {
      this.amount.fiat = parseFloat(this.formData.amount);
      this.amount.micros = this.rateService.fromFiatToMicros(this.amount.fiat, this.availableUnits[1].name);
      this.amount.mrt =  this.rateService.fromFiatToMerit(this.amount.fiat, this.availableUnits[1].name);
    }
    this.amount.mrtStr = this.txFormatService.formatAmountStr(this.amount.micros);
    this.amount.fiatStr = await this.txFormatService.formatAlternativeStr(this.amount.micros);
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
    )
  }

  public toConfirm() {

    if (this.formData.password != this.formData.confirmPassword) {
      return  this.toastCtrl.create({
        message: 'Passwords do not match',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    let loadingSpinner = this.loadingCtrl.create({
      content: "Preparing transaction...",
      dismissOnPageChange: true
    });
    loadingSpinner.present();
    this.createTxp({dryRun:false}).then(() => {
      loadingSpinner.dismiss();
      this.navCtrl.push('SendConfirmView', {txData: this.txData, referralsToSign: this.referralsToSign});
    }).catch(() => {
      loadingSpinner.dismiss();
    });
  }

  public  updateExpirationDate() {
    let modal = this.modalCtrl.create('SendValidTill', {nbBlocks: this.formData.nbBlocks});
    modal.present();
    modal.onDidDismiss((nbBlocks) => {
      if (nbBlocks) this.formData.nbBlocks = nbBlocks;
      this.updateTxData();
    });
  }

  private updateTxData() {
    this.feeCalcError = null;

    if (!this.amount.micros) {
      this.txData = null;
      return this.createTxpDebounce.cancel();
    } else if (this.amount.micros > this.selectedWallet.status.spendableAmount) {
      this.feeCalcError = 'Amount is too big';
      this.txData = null;
      return this.createTxpDebounce.cancel();
    } else {

      this.txData = {
        txp: null,
        wallet: this.selectedWallet,
        amount: this.amount.micros,
        feeAmount: null,
        totalAmount: this.amount.micros,
        recipient: this.recipient,
        sendMethod: this.sendMethod,
        feeIncluded: this.feeIncluded,
        timeout: this.formData.nbBlocks
      };

      this.createTxpDebounce({dryRun:true});
    }
  }

  private createTxpDebounce = _.debounce((opts:{dryRun:boolean}) => {
    this.createTxp(opts);
  }, 1000);

  private async createTxp(opts:{dryRun:boolean}) {

    let data:any = {
      toAddress: this.txData.recipient.meritAddress,
      toName: this.txData.recipient.name || '',
      toAmount: this.txData.amount,
      allowSpendUnconfirmed: this.allowUnconfirmed,
      feeLevel: this.selectedFeeLevel
    };

    if (this.amount == this.selectedWallet.status.spendableAmount) {
      data.sendMax = true;
      this.feeIncluded = true;
    }

    let easyData:any = await this.getEasyData();
    data = Object.assign(data, _.pick(easyData, 'script', 'toAddress'));
    data.toAddress = data.toAddress || easyData.scriptAddress;

    let txpOut = await this.getTxp(_.clone(data), this.selectedWallet, opts.dryRun);
    this.txData.txp = txpOut;
    this.txData.easySend = easyData;
    this.referralsToSign = _.filter([easyData.recipientReferralOpts, easyData.scriptReferralOpts]);

    //todo calculate fee (txpOut.size*feeLevel.feePerKb + easySend.size*feeLevel.feePerKb)
    //FOR EACH AVAILABLE LEVEL!
    // WITH PERCENTS

  }

  private getEasyData() {
    if (this.txData.sendMethod.type != SendMethod.TYPE_EASY) {
      return Promise.resolve({});
    } else {
      return this.easySendService.createEasySendScriptHash(this.txData.wallet).then((easySend) => {
        easySend.script.isOutput = true;
        this.txData.easySendURL = easySendURL(easySend);
        return {
          script: easySend.script,
          toAddress: easySend.scriptAddress.toString(),
          scriptReferralOpts: easySend.scriptReferralOpts,
          recipientReferralOpts: easySend.recipientReferralOpts,
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
        return Promise.reject(new Error("The amount is too big")); //.  Because, Javascript.
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
      txp.dryRun = dryRun;
      if (!dryRun) {
        if (this.feeIncluded) {
          txp.fee = this.txData.feeAmount;
          txp.inputs = this.txData.txp.inputs;
          txp.outputs[0].amount = this.txData.amount - this.txData.feeAmount;
        }
      }
      return this.walletService.createTx(wallet, txp);
  }



}

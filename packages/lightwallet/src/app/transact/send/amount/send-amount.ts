import { Component, HostListener, SecurityContext } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import * as _ from 'lodash';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { Logger } from 'merit/core/logger';
import { ProfileService } from "merit/core/profile.service";
import { ConfigService } from "merit/shared/config.service";
import { RateService } from 'merit/transact/rate.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { TxFormatService } from "merit/transact/tx-format.service";
import { DomSanitizer } from '@angular/platform-browser';
import { FeeService } from 'merit/shared/fee/fee.service'
import { WalletService } from 'merit/wallets/wallet.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { EasySend, easySendURL } from 'merit/transact/send/easy-send/easy-send.model';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';


@IonicPage()
@Component({
  selector: 'send-amount-view',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {

  public contact: MeritContact;
  public sendingOptions: any[];
  public recipient: any;
  public amount: number;
  public lastAmount: number = -1;
  public amountMerit: number;
  public smallFont: boolean;
  public globalResult: string;
  public sending: boolean;
  public displayName: string;
  public wallets:any;
  public wallet:any;
  public amountCurrency:string;
  public loading:boolean;
  public hasFunds:boolean;
  public feeIncluded:boolean = false;
  public feeCalcError:string;
  public feeMrt:number;
  public feeFiat:number;
  public feePercent:string;

  public availableAmount = {value: 0, formatted: ''};

  private static FEE_LEVEL = 'normal'; //todo make selectable
  private static ALLOW_UNCONFIRMED = true; //obtain from settings

  private static FEE_TOO_HIGH_LIMIT_PER = 15;
  private LENGTH_EXPRESSION_LIMIT = 19;
  private SMALL_FONT_SIZE_LIMIT = 10;
  private availableUnits: Array<any> = [];
  private unitIndex: number = 0;
  private reNr: RegExp = /^[1234567890\.]$/;
  private reOp: RegExp = /^[\*\+\-\/]$/;

  private txData;
  private referralsToSign: Array<any>;

  public refreshFeeAvailable:boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger: Logger,
    private profileService:ProfileService,
    private configService:ConfigService,
    private modalCtrl:ModalController,
    private rateService:RateService,
    private txFormatService:TxFormatService,
    private sanitizer:DomSanitizer,
    private feeService:FeeService,
    private walletService:WalletService,
    private easySendService:EasySendService,
    private toastCtrl:MeritToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.loading = true;
    return this.profileService.hasFunds().then((hasFunds) => {
      this.hasFunds = hasFunds;
      this.contact = this.navParams.get('contact');
      this.sending = this.navParams.get('sending');
      this.displayName = !_.isEmpty(this.contact.name) ? this.contact.name.formatted : this.contact.meritAddresses[0].address;
      this.populateSendingOptions();

      this.profileService.getWallets().then((wallets) => {
        this.wallets = wallets;
        if (this.wallets && this.wallets[0]) {
          this.wallet = this.wallets[0];
        }

        this.getAvailableAmount().then((amount) => {
          this.availableAmount = amount;
          if (this.navParams.get('amount')) {
            this.amount = this.rateService.microsToMrt(this.navParams.get('amount'));
            this.updateTxData();
          }
        });
        this.loading = false;
      });

      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      ];
      this.amountCurrency = this.availableUnits[0];
    });
  }

  populateSendingOptions() {
    let empty = {
      sendMethod: '',
      meritAddress: '',
      email: '',
      phoneNumber: '',
      label: '',
    };
    this.sendingOptions = _.concat(
      _.map(this.contact.meritAddresses, (addrObject) => {
        return _.defaults({
          sendMethod: 'address',
          meritAddress: addrObject.address,
          label: `Merit: ${addrObject.address}`
        }, empty);
      }),
      _.map(this.contact.emails, (emailObj) => {
        return _.defaults({
          sendMethod: 'email',
          email: emailObj.value,
          label: `Email:  ${emailObj.value}`
        }, empty);
      }),
      _.map(this.contact.phoneNumbers, (phoneNumberObj) => {
        return _.defaults({
          sendMethod: 'sms',
          phoneNumber: phoneNumberObj.value,
          label: `SMS:  ${phoneNumberObj.value}`
        }, empty);
      })
    );
    this.recipient = _.head(this.sendingOptions);
  };

  selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
      this.getAvailableAmount().then((amount) => {
        this.availableAmount = amount;
        this.updateTxData();
      });
    });
  }

  selectSendingOption() {
    let modal = this.modalCtrl.create('SelectSendingOptionModal', {
      selectedSendingOption: this.recipient,
      sendingOptions: this.sendingOptions
    });
    modal.present();
    modal.onDidDismiss((recipient) => {
      if(recipient) this.recipient = recipient;
      this.updateTxData();
    });
  }

  toggleCurrency() {
    this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
    this.updateAmountMerit();
    this.updateTxData();
    this.getAvailableAmount().then((amount) => {
      this.availableAmount = amount;
    });
  }

  toggleFeeIncluded() {
    this.updateTxData();
  }


  updateAmountMerit() {
    if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
      this.amountMerit = this.amount;
    } else {
      this.amountMerit = this.rateService.fromFiatToMerit(this.amount, this.amountCurrency);
    }
  }

  checkFontSize() {
    if (this.amount && this.amount.toString().length >= this.SMALL_FONT_SIZE_LIMIT) this.smallFont = true;
    else this.smallFont = false;
  };

  processAmount(value) {
    if(value != this.lastAmount) {
      this.lastAmount = value;
      this.updateTxData();
    }
  };

  sendAllowed() {
    return (
      this.amount > 0
      && this.amount <= this.availableAmount.value
      && !_.isNil(this.txData.txp)
    )
  }

  toConfirm() {
    let loadingSpinner = this.loadingCtrl.create({
      content: "Preparing transaction...",
      dismissOnPageChange: true
    });
    loadingSpinner.present();
    let dryRun = false;
    this.createTxp(dryRun).then(() => {
      loadingSpinner.dismiss();
      this.navCtrl.push('SendConfirmView', {txData: this.txData, referralsToSign: this.referralsToSign});
    }).catch(() => {
      loadingSpinner.dismiss();
    });



  }

  toBuyAndSell() {
    this.navCtrl.push('BuyAndSellView');
  }


  private getAvailableAmount():Promise<any> {
    return new Promise((resolve, reject) => {

      let currency = this.amountCurrency.toUpperCase();

      if (!this.wallet || !this.wallet.status) return resolve({value: 0, formatted: '0.0 '+currency});

      let amount = this.wallet.status.spendableAmount;

      if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
        let formatted = this.txFormatService.formatAmount(amount);
        return resolve({value: this.rateService.microsToMrt(amount), formatted: formatted+' '+currency});
      } else {
        let fiatAmount = this.rateService.fromMicrosToFiat(amount, currency);
        return resolve({value: fiatAmount, formatted: fiatAmount.toFixed(2)+' '+currency});
      }
    });
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  public updateTxData() {
    this.refreshFeeAvailable = false;

    this.updateAmountMerit();

    this.feeCalcError = null;
    this.feeMrt = null;
    this.feePercent = null;
    this.txData = {
      txp: null,
      wallet: this.wallet,
      amount: this.rateService.mrtToMicro(this.amountMerit),
      feeAmount: null,
      totalAmount: this.rateService.mrtToMicro(this.amountMerit),
      recipient: this.recipient,
      feeIncluded: this.feeIncluded
    };

    if (!this.txData.amount) {
      return this.createTxpDebounce.cancel();
    };

    if (this.txData.amount > this.rateService.mrtToMicro(this.availableAmount.value)) {
      this.feeCalcError = 'Amount is too big';
      return this.createTxpDebounce.cancel();
    }

    let dryRun = true;
    this.createTxpDebounce(dryRun);

  }

  private createTxpDebounce = _.debounce((dryRun:boolean) => {
    this.createTxp(dryRun);
  }, 1000);

  private createTxp(dryRun:boolean) {


    return this.feeService.getWalletFeeRate(this.wallet, SendAmountView.FEE_LEVEL).then((feeRate) => {

        let data = {
          toAddress: this.txData.recipient.meritAddress,
          toName: this.txData.recipient.name || '',
          toAmount: this.txData.amount,
          allowSpendUnconfirmed: SendAmountView.ALLOW_UNCONFIRMED,
          feeLevelName:  SendAmountView.FEE_LEVEL
        };

        let getEasyData = () => {
          return new Promise((resolve, reject) => {
            if (this.recipient.sendMethod != 'address') {
              return this.easySendService.createEasySendScriptHash(this.txData.wallet).then((easySend) => {
                easySend.script.isOutput = true;
                this.txData.easySendURL = easySendURL(easySend);
                return resolve({
                  script: easySend.script,
                  toAddress: easySend.scriptAddress.toString(),
                  scriptReferralOpts: easySend.scriptReferralOpts,
                  recipientReferralOpts: easySend.recipientReferralOpts,
                });
              });
            } else {
              return resolve({});
            }
          });
        };

        return getEasyData().then((easyData: EasySend) => {
          data = Object.assign(data, _.pick(easyData, 'script', 'toAddress'));
          return this.getTxp(_.clone(data), this.txData.wallet, dryRun).then((txpOut) => {

            txpOut.feeStr = this.txFormatService.formatAmountStr(txpOut.fee);
            return this.txFormatService.formatAlternativeStr(txpOut.fee).then((v) => {
              txpOut.alternativeFeeStr = v;

              let percent = (txpOut.fee / (txpOut.amount + txpOut.fee) * 100);

              let precision = 1;
              if (percent > 0) {
                while (percent*Math.pow(10, precision) < 1) {
                  precision++;
                }
              }
              precision++; //showing two valued digits

              txpOut.feePercent = percent.toFixed(precision) + '%';

              this.feePercent = txpOut.feePercent;
              this.txData.feeAmount = txpOut.fee;
              this.feeMrt = this.rateService.microsToMrt(txpOut.fee);
              this.feeFiat = this.rateService.fromMicrosToFiat(txpOut.fee, this.availableUnits[1]);

              this.txData.txp = txpOut;
              this.referralsToSign = _.filter([easyData.recipientReferralOpts, easyData.scriptReferralOpts]);
            }).catch((err) => {
              this.toastCtrl.create({
                message: err,
                cssClass: ToastConfig.CLASS_ERROR
              }).present();
            })
          });
        });

      }).catch((err) => {
        if (err.code == Errors.CONNECTION_ERROR.code) {
          this.refreshFeeAvailable = true;
        }
        this.feeCalcError = err.text || 'Unknown error';
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
        return reject(new Error('Need a shared encryption key to add message!'));
      }

      if (tx.toAmount > Number.MAX_SAFE_INTEGER) {
        return reject(new Error("The amount is too big")); //.  Because, Javascript.
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
      txp.excludeUnconfirmedUtxos = !tx.allowSpendUnconfirmed;
      if (!dryRun) {
        txp.dryRun = dryRun;
        if (this.feeIncluded) {
          txp.fee = this.txData.feeAmount;
          txp.inputs = this.txData.txp.inputs;
          txp.outputs[0].amount = this.txData.amount - this.txData.feeAmount;
        }
      }
      return this.walletService.createTx(wallet, txp).then((ctxp) => {
        this.logger.debug("CREATED TXP", ctxp);
        return resolve(ctxp);
      }).catch((err) => {
        if (err.code == Errors.CONNECTION_ERROR.code) {
          this.refreshFeeAvailable = true;
        }
        this.feeCalcError = err.text || 'Unknown error';
        return reject(err);
      });
    });
  }

}

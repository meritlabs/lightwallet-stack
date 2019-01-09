import { Component, ElementRef, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ISendMethod, SendMethodType } from '@merit/common/models/send-method';
import { ConfigService } from '@merit/common/services/config.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { ISendTxData, SendService } from '@merit/common/services/send.service';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import {
  AlertController,
  Events,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';

@IonicPage()
@Component({
  selector: 'view-send-amount',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {
  public recipient: MeritContact;
  public sendMethod: ISendMethod;

  public availableUnits: Array<{ type: string; name: string }>;
  public selectedCurrency: { type: string; name: string };

  public txData: ISendTxData;
  public feeCalcError: string;

  public amount = { micros: 0, mrt: 0, fiat: 0 };
  public formData = {
    amount: '',
    password: '',
    confirmPassword: '',
    nbBlocks: 10080,
    validTill: '',
    destination: '',
  };

  public readonly CURRENCY_TYPE_MRT = 'mrt';
  public readonly CURRENCY_TYPE_FIAT = 'fiat';

  public wallets: Array<any>;
  public selectedWallet: any;

  public suggestedAmounts = {};
  public lastAmount: string;

  public feePercent: number;
  public feeIncluded: boolean = false;
  public feeTogglerEnabled: boolean = true;

  private loading: boolean = true;

  @ViewChild('amount')
  amountInput: ElementRef;
  @ViewChild('confirmInput')
  confirmInput: ElementRef;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private configService: ConfigService,
    private rateService: RateService,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private sendService: SendService,
    private events: Events,
    private logger: LoggerService,
  ) {
    this.recipient = this.navParams.get('contact');
    this.sendMethod = this.navParams.get('suggestedMethod');
    this.loading = true;
  }

  async ngOnInit() {
    this.txData = null;
    await this.updateTxData();

    this.availableUnits = [
      { type: this.CURRENCY_TYPE_MRT, name: this.configService.get().wallet.settings.unitCode.toUpperCase() },
    ];
    const rate = await this.rateService.getRate(this.configService.get().wallet.settings.alternativeIsoCode);
    if (rate > 0) {
      this.availableUnits.push({
        type: this.CURRENCY_TYPE_FIAT,
        name: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
      });
    }
    this.selectedCurrency = this.availableUnits[0];
    let passedAmount = this.navParams.get('amount');
    if (passedAmount) {
      this.formData.amount = String(this.rateService.microsToMrt(passedAmount));
      //this.createTxp();
    }

    await this.updateAmount();

    // todo add smart common amounts receive
    this.suggestedAmounts[this.CURRENCY_TYPE_MRT] = ['5', '10', '100'];
    this.suggestedAmounts[this.CURRENCY_TYPE_FIAT] = ['5', '10', '100'];

    this.wallets = await this.profileService.getWallets();
    this.chooseAppropriateWallet();

    this.loading = false;
    this.updateTxData();

    this.events.subscribe('Remote:IncomingTx', () => {
      this.profileService.refreshData();
    });
  }

  private chooseAppropriateWallet() {
    if (this.wallets && this.wallets[0]) {
      this.selectedWallet = this.navParams.get('wallet');
      if (!this.selectedWallet) {
        this.selectedWallet = this.wallets.find(w => w.confirmed);
        const passedAmount = this.navParams.get('amount') || 0;
        this.selectedWallet = this.wallets.find(w => {
          return (
            w.balance.spendableAmount > 0 &&
            w.balance.spendableAmount >= passedAmount &&
            (this.sendMethod.type != SendMethodType.Easy || w.availableInvites)
          );
        });
      }
    }
  }

  selectWallet() {
    const modal = this.modalCtrl.create(
      'SelectWalletModal',
      {
        selectedWallet: this.selectedWallet,
        showInvites: this.sendMethod.type == SendMethodType.Easy,
        availableWallets: this.wallets.filter(w => {
          return w.balance.spendableAmount && (this.sendMethod.type != SendMethodType.Easy || w.availableInvites);
        }),
      },
      MERIT_MODAL_OPTS,
    );

    modal.onDidDismiss(async wallet => {
      if (wallet) {
        this.selectedWallet = wallet;
        this.updateTxData();
      }
    });

    modal.present();
  }

  showFeeIncludedTooltip() {
    this.alertCtrl
      .create({
        title: 'Include fee',
        message:
          'If you choose this option, amount size that recipient receives will be reduced by fee size. Otherwise fee will be charged from your balance',
        buttons: ['Got it'],
      })
      .present();
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

  passwordKeyup(key) {
    if (key == 13) {
      this.confirmInput['_native']['nativeElement'].focus();
    }
    if (!this.formData.password) {
      this.updateTxData();
    }
  }

  confirmPasswordKeypress(key) {
    return this.updateTxData();
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
        await this.rateService.fiatToMicros(this.amount.fiat, this.availableUnits[1].name),
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
      this.amount.micros > 0 &&
      this.selectedWallet &&
      !this.feeCalcError &&
      (!this.formData.password || this.formData.password === this.formData.confirmPassword)
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
    const loader = this.loadingCtrl.create({
      content: 'Calculating fee...',
      dismissOnPageChange: true,
    });

    loader.present();

    if (this.sendMethod.type === SendMethodType.Easy) {
      const destinationType = getSendMethodDestinationType(this.formData.destination);

      if (destinationType) {
        this.sendMethod.destination = destinationType;
        this.sendMethod.value = this.formData.destination;
      }
    }

    try {
      const fee = await this.sendService.estimateFee(
        this.selectedWallet,
        this.amount.micros,
        this.sendMethod.type == SendMethodType.Easy,
        this.sendMethod.value,
      );
      if (this.formData.password && this.formData.password != this.formData.confirmPassword) {
        this.feeCalcError = 'Passwords do not match';
      }
      this.navCtrl.push('SendConfirmationView', {
        txData: {
          amount: this.amount.micros,
          password: this.formData.password,
          fee: fee,
          wallet: this.selectedWallet,
          feeIncluded: this.feeIncluded,
          sendMethod: this.sendMethod,
          toAddress: this.sendMethod.value || 'MeritMoney link',
          recipient: this.recipient,
        },
      });
    } catch (e) {
      this.logger.warn(e);
      return (this.feeCalcError = e.message);
    } finally {
      loader.dismiss();
    }
  }

  public async updateTxData() {
    //this.feeLoading = true;
    this.feeCalcError = null;
    this.feePercent = null;

    if (!this.selectedWallet) {
      return (this.feeCalcError = 'No wallet selected');
    }

    if (this.amount.micros > this.selectedWallet.balance.spendableAmount) {
      return (this.feeCalcError = 'Amount is too big');
    }

    if (this.formData.password && this.formData.password != this.formData.confirmPassword) {
      return (this.feeCalcError = 'Passwords do not match');
    }
  }
}

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
import { AlertController, Events, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';
import { SendFormController } from '@merit/common/controllers/send-form.controller';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { FormBuilder } from '@angular/forms';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { getLatestValue } from '@merit/common/utils/observables';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-send-amount',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {
  recipient: MeritContact;

  ctrl: SendFormController;

  get amountMrt() {
    return this.ctrl.formData.get('amountMrt');
  }

  get selectedCurrency() {
    return this.ctrl.formData.get('selectedCurrency');
  }

  get feeIncluded() {
    return this.ctrl.formData.get('feeIncluded');
  }

  get wallet() {
    return this.ctrl.formData.get('wallet');
  }

  get type() {
    return this.ctrl.formData.get('type');
  }

  get password() {
    return this.ctrl.formData.get('password');
  }

  get confirmPassword() {
    return this.ctrl.formData.get('confirmPassword');
  }

  get address() {
    return this.ctrl.formData.get('address');
  }

  get destination() {
    return this.ctrl.formData.get('destination');
  }

  public formData = {
    nbBlocks: 10080,
  };

  readonly CURRENCY_TYPE_MRT = 'mrt';
  readonly CURRENCY_TYPE_FIAT = 'fiat';

  suggestedAmounts = {};
  lastAmount: string;

  feeTogglerEnabled: boolean = true;

  loading: boolean = true;

  sendMethod: ISendMethod;

  @ViewChild('amount') amountInput: ElementRef;
  @ViewChild('confirmInput') confirmInput: ElementRef;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private configService: ConfigService,
    private rateService: RateService,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private sendService: SendService,
    private events: Events,
    private logger: LoggerService,
    private store: Store<IRootAppState>,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingControllerService,
    private toastCtrl: ToastControllerService,
  ) {
    this.ctrl = new SendFormController(store, formBuilder, sendService, logger, loadingCtrl, toastCtrl, rateService);
  }

  async ngOnInit() {
    await this.ctrl.init();

    const { contact, suggestedMethod, amount } = this.navParams.data;

    if (suggestedMethod) {
      console.log('Suggested method is ', suggestedMethod);
      this.sendMethod = suggestedMethod;

      this.type.setValue(suggestedMethod.type);

      if (suggestedMethod.type === SendMethodType.Classic) {
        this.address.setValue(suggestedMethod.alias || suggestedMethod.address);
      }
    }

    this.recipient = contact;

    if (amount) {
      this.amountMrt.setValue(amount);
      this.amountMrt.markAsDirty();
      this.amountMrt.updateValueAndValidity();
    }

    // todo add smart common amounts receive
    this.suggestedAmounts[this.CURRENCY_TYPE_MRT] = ['5', '10', '100'];
    this.suggestedAmounts[this.CURRENCY_TYPE_FIAT] = ['5', '10', '100'];

    this.ctrl.receipt$.subscribe(receipt => console.log(receipt, { ...this.ctrl.formData.getRawValue() }));
    this.ctrl.formData.valueChanges.subscribe(val => console.log({...val}))
  }

  async selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal',
      {
        selectedWallet: this.wallet.value,
        showInvites: this.type.value == SendMethodType.Easy,
        availableWallets: await getLatestValue(this.ctrl.wallets$),
      }, MERIT_MODAL_OPTS);

    modal.onDidDismiss((wallet: DisplayWallet) => {
      if (wallet) {
        this.ctrl.selectWallet(wallet);
      }
    });

    return modal.present();
  }

  showFeeIncludedTooltip() {
    this.alertCtrl.create({
      title: 'Include fee',
      message: 'If you choose this option, amount size that recipient receives will be reduced by fee size. Otherwise fee will be charged from your balance',
      buttons: ['Got it'],
    }).present();
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
  }

  isSendAllowed() {
    return !this.ctrl.formData.pending && this.ctrl.formData.valid && this.ctrl.canSend;
  }

  getAmountClass() {
    const { length } = String(this.amountMrt.value || 0);
    if (length < 6) return 'amount-big';
    if (length < 8) return 'amount-medium';
    if (length < 11) return 'amount-small';
    return 'amount-tiny';
  }

  public async toConfirm() {
    this.navCtrl.push('SendConfirmationView', {
      sendFormCtrl: this.ctrl,
      recipient: this.recipient,
      sendMethod: this.sendMethod,
    });
  }
}

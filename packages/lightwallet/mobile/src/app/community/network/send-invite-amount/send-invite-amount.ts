import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { SendMethodType } from '@merit/common/models/send-method';
import { LoggerService } from '@merit/common/services/logger.service';
import { validateEmail, validatePhoneNumber } from '@merit/common/utils/destination';
import { WalletService } from '@merit/common/services/wallet.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IonicPage, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { SendInviteFormController } from '@merit/common/controllers/send-invite-form.controller';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '@merit/common/services/alert.service';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { couldBeAlias, isAddress } from '@merit/common/utils/addresses';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-send-invite-amount',
  templateUrl: 'send-invite-amount.html',
})
export class SendInviteAmountView {

  @ViewChild('amount') amountInput: ElementRef;

  showShareButton = this.plt.is('cordova') && SocialSharing.installed();
  amountFocused: boolean;
  ctrl: SendInviteFormController;
  customDestination: string = '';


  get address() {
    return this.ctrl.address;
  }

  get type() {
    return this.ctrl.type;
  }

  get destination() {
    return this.ctrl.destination;
  }

  get amountInv() {
    return this.ctrl.amount;
  }

  get wallet() {
    return this.ctrl.wallet;
  }

  get password() {
    return this.ctrl.password;
  }

  get confirmPassword() {
    return this.ctrl.confirmPassword;
  }

  constructor(
    store: Store<IRootAppState>,
    formBuilder: FormBuilder,
    walletService: WalletService,
    private toastCtrl: ToastControllerService,
    logger: LoggerService,
    alertCtrl: AlertService,
    loadingCtrl: LoadingControllerService,
    private plt: Platform,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    private navCtrl: NavController,
  ) {
    this.ctrl = new SendInviteFormController(store, formBuilder, walletService, logger, toastCtrl, loadingCtrl, alertCtrl);
  }

  async ngOnInit() {
    await this.ctrl.init();
  }

  onDestinationChange() {
    const value = this.customDestination;

    if ((validateEmail(value) || validatePhoneNumber(value)) && this.type.value == SendMethodType.Classic) {
      this.type.setValue(SendMethodType.Easy);
      this.destination.setValue(validatePhoneNumber(value) ? value.replace(/\D+/g, '') : value);
    } else if ((couldBeAlias(value) || isAddress(value) && this.type.value == SendMethodType.Easy)) {
      this.type.setValue(SendMethodType.Classic);
      this.address.setValue(value);
    } else if (!value || !value.length) {
      this.type.setValue(SendMethodType.Easy);
    }
  }

  async send() {
    await this.ctrl.sendInvite(this.wallet.value.client);

    if (this.ctrl.success) {
      if (this.type.value === SendMethodType.Classic) {
        this.navCtrl.pop();
      }
    }
  }

  ionViewDidEnter() {
    this.focusInput();
  }

  async selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.ctrl.selectedWallet,
      showInvites: true,
      wallets: this.ctrl.wallets$,
    }, MERIT_MODAL_OPTS);

    modal.onDidDismiss((wallet: DisplayWallet) => {
      if (wallet) {
        this.ctrl.selectWallet(wallet);
      }
    });

    return modal.present();
  }

  isSendAllowed() {
    return !this.ctrl.formData.pending && this.ctrl.formData.valid;
  }

  amountKeypress(key) {
    if (key == 13) return this.amountInput['_native']['nativeElement'].blur();
  }

  focusInput() {
    this.amountInput['_native']['nativeElement'].focus();
    this.amountFocused = true;
  }

  share() {
    return this.socialSharing.share(this.ctrl.easySendUrl);
  }
}

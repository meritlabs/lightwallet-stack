import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { SendMethodType } from '@merit/common/models/send-method';
import { LoggerService } from '@merit/common/services/logger.service';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';
import { WalletService } from '@merit/common/services/wallet.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IonicPage, ModalController, NavParams, Platform } from 'ionic-angular';
import { SendInviteFormController } from '@merit/common/controllers/send-invite-form.controller';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '@merit/common/services/alert.service';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { couldBeAlias, isAddress, isEmail, isPhoneNumber } from '@merit/common/utils/addresses';
import { getLatestValue } from '@merit/common/utils/observables';
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
  formCtrl: SendInviteFormController;
  customDestination: string = '';

  get address() {
    return this.formCtrl.address;
  }

  get type() {
    return this.formCtrl.type;
  }

  get destination() {
    return this.formCtrl.destination;
  }

  get amount() {
    return this.formCtrl.amount;
  }

  constructor(
    store: Store<IRootAppState>,
    formBuilder: FormBuilder,
    walletService: WalletService,
    toastCtrl: ToastControllerService,
    logger: LoggerService,
    alertCtrl: AlertService,
    loadingCtrl: LoadingControllerService,
    private plt: Platform,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {
    this.formCtrl = new SendInviteFormController(store, formBuilder, walletService, logger, toastCtrl, loadingCtrl, alertCtrl);
  }

  async ngOnInit() {
    await this.formCtrl.init();
  }

  onDestinationChange() {
    const value = this.customDestination;

    if ((couldBeAlias(value) || isAddress(value) && this.formCtrl.type == SendMethodType.Easy)) {
      this.formCtrl.type.setValue(SendMethodType.Classic);
      this.formCtrl.destination.setValue(value);
    } else if ((isEmail(value) || isPhoneNumber(value)) && this.formCtrl.type == SendMethodType.Classic) {
      this.formCtrl.type.setValue(SendMethodType.Easy);
      this.formCtrl.address.setValue(value);
    }
  }

  ionViewDidEnter() {
    this.focusInput();
  }

  async selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.formCtrl.selectedWallet,
      showInvites: true,
      availableWallets: await getLatestValue(this.formCtrl.wallets$),
    }, MERIT_MODAL_OPTS);

    modal.onDidDismiss((wallet: DisplayWallet) => {
      if (wallet) {
        this.formCtrl.selectWallet(wallet);
      }
    });

    return modal.present();
  }

  amountKeypress(key) {
    if (key == 13) return this.amountInput['_native']['nativeElement'].blur();
  }

  focusInput() {
    this.amountInput['_native']['nativeElement'].focus();
    this.amountFocused = true;
  }
}

import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ISendMethod, SendMethodDestination, SendMethodType } from '@merit/common/models/send-method';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { RateService } from '@merit/common/services/rate.service';
import { ISendTxData, SendService } from '@merit/common/services/send.service';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { TouchIdService } from '@merit/mobile/services/touch-id.service';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { SendFormController } from '@merit/common/controllers/send-form.controller';
import { MeritContact } from '@merit/common/models/merit-contact';
import { getLatestValue } from '@merit/common/utils/observables';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'view-send-confirmation',
  templateUrl: 'send-confirmation.html'
})
export class SendConfirmationView {

  txData: ISendTxData;
  viewData: any;
  unlockValue: number = 0;

  ctrl: SendFormController;
  recipient: MeritContact;
  sendMethod: ISendMethod;
  priceReviewClass: string = '';

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private toastCtrl: ToastControllerService,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private rateService: RateService,
              private logger: LoggerService,
              private sendService: SendService
  ) {}

  ionViewDidEnter() {
    this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    this.navCtrl.swipeBackEnabled = true;
  }

  async ngOnInit() {
    const { sendFormCtrl, recipient, sendMethod } = this.navParams.data;
    this.ctrl = sendFormCtrl;
    this.recipient = recipient;
    this.sendMethod = sendMethod;

    const amountMrtLength = String(sendFormCtrl.amountMrt.value).length;

    if (amountMrtLength < 5) {
      this.priceReviewClass = 'big';
    } else if (amountMrtLength < 9) {
      this.priceReviewClass = 'medium';
    } else if (amountMrtLength < 12) {
      this.priceReviewClass = 'small';
    } else {
      this.priceReviewClass = 'tiny';
    }
  }

  async send() {
    this.ctrl.submit.next();
    console.log('Submitted.. waiting for status');

    const success = await getLatestValue(this.ctrl.onSubmit$);

    if (success) {
      if (this.sendMethod.type === SendMethodType.Easy) {
        this.navCtrl.push('EasySendShareView', { sendFormCtrl: this.ctrl });
      } else {
        this.navCtrl.popToRoot();
        this.toastCtrl.success('Your transaction is complete');
      }
    } else {
      this.toastCtrl.error(this.ctrl.error || 'Unknown error occurred while sending your transaction.');
    }
  }

  getContactInitials(contact) {
    if (!contact.name || !contact.name.formatted) return '';
    let nameParts = contact.name.formatted.toUpperCase().replace(/\s\s+/g, ' ').split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
    return name;
  }

}

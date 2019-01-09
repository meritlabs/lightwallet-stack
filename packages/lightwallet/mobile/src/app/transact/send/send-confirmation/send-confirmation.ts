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

@IonicPage()
@Component({
  selector: 'view-send-confirmation',
  templateUrl: 'send-confirmation.html',
})
export class SendConfirmationView {
  txData: ISendTxData;
  viewData: any;
  unlockValue: number = 0;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private toastCtrl: ToastControllerService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private rateService: RateService,
    private logger: LoggerService,
    private sendService: SendService,
  ) {
    this.txData = navParams.get('txData');
  }

  ionViewDidEnter() {
    this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    this.navCtrl.swipeBackEnabled = true;
  }

  async ngOnInit() {
    const viewData: any = {
      recipient: this.txData.recipient,
      amount: this.txData.amount,
      totalAmount: this.txData.feeIncluded ? this.txData.amount : this.txData.amount + this.txData.fee,
      password: this.txData.password,
      fee: this.txData.fee,
      walletName: this.txData.wallet.name || this.txData.wallet.id,
      walletColor: this.txData.wallet.color,
      walletCurrentBalance: this.txData.wallet.balance.totalAmount,
      feeIncluded: this.txData.feeIncluded,
      methodName: this.txData.sendMethod.type == SendMethodType.Easy ? 'MeritMoney Link' : 'Classic Send',
      destination: this.txData.sendMethod.alias ? '@' + this.txData.sendMethod.alias : this.txData.sendMethod.value,
      easySendDelivered: this.navParams.get('easySendDelivered'),
    };

    viewData.walletRemainingBalance = this.txData.wallet.balance.totalAmount - viewData.totalAmount;

    const amountMrtLength = (this.rateService.microsToMrt(viewData.amount) + '').length;

    if (amountMrtLength < 5) {
      viewData.priceReviewClass = 'big';
    } else if (amountMrtLength < 9) {
      viewData.priceReviewClass = 'medium';
    } else if (amountMrtLength < 12) {
      viewData.priceReviewClass = 'small';
    } else {
      viewData.priceReviewClass = 'tiny';
    }

    this.viewData = viewData;
  }

  async send() {
    const loadingSpinner = this.loadingCtrl.create({
      content: 'Sending transaction...',
      dismissOnPageChange: true,
    });
    loadingSpinner.present();

    try {
      await this.sendService.send(this.txData.wallet, this.txData);

      if (this.txData.sendMethod.type === SendMethodType.Easy) {
        let easySendDelivered;

        if (
          this.txData.sendMethod.destination === SendMethodDestination.Email ||
          this.txData.sendMethod.destination === SendMethodDestination.Sms
        ) {
          try {
            await this.txData.wallet.deliverGlobalSend(this.txData.easySend, {
              type: SendMethodType.Easy,
              destination: this.txData.sendMethod.destination,
              value: this.txData.sendMethod.value,
            });
            easySendDelivered = true;
          } catch (err) {
            this.logger.error('Unable to deliver GlobalSend', err);
            easySendDelivered = false;
          }
        }

        this.navCtrl.push('EasySendShareView', { txData: this.txData, easySendDelivered });
      } else {
        this.navCtrl.popToRoot();
        this.toastCtrl.success('Your transaction is complete');
      }
    } catch (err) {
      this.logger.warn(err);
      return this.toastCtrl.error(err);
    } finally {
      loadingSpinner.dismiss();
      this.txData.referralsToSign = [];
    }
  }

  getContactInitials(contact) {
    if (!contact.name || !contact.name.formatted) return '';
    let nameParts = contact.name.formatted
      .toUpperCase()
      .replace(/\s\s+/g, ' ')
      .split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
    return name;
  }
}

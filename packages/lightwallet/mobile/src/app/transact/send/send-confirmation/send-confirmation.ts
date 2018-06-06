import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasySend } from '@merit/common/models/easy-send';
import { ISendMethod, SendMethodDestination, SendMethodType } from '@merit/common/models/send-method';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { RateService } from '@merit/common/services/rate.service';
import { ISendTxData, SendService } from '@merit/common/services/send.service';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { TouchIdService } from '@merit/mobile/services/touch-id.service';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import * as  _ from 'lodash';

@IonicPage()
@Component({
  selector: 'view-send-confirmation',
  templateUrl: 'send-confirmation.html'
})
export class SendConfirmationView {

  txData: ISendTxData;
  viewData: any;
  unlockValue: number = 0;

  constructor(navParams: NavParams,
              private navCtrl: NavController,
              private toastCtrl: ToastControllerService,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private touchIdService: TouchIdService,
              private walletService: WalletService,
              private formatService: TxFormatService,
              private rateService: RateService,
              private configService: ConfigService,
              private logger: LoggerService,
              private persistenceService: PersistenceService2,
              private sendService: SendService) {
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
      totalAmount: this.txData.feeIncluded ? this.txData.amount : this.txData.amount + this.txData.txp.fee + this.txData.easyFee,
      password: this.txData.password,
      feePercent: this.txData.txp.feePercent,
      fee: this.txData.txp.fee + this.txData.easyFee,
      walletName: this.txData.wallet.name || this.txData.wallet.id,
      walletColor: this.txData.wallet.color,
      walletCurrentBalance: this.txData.wallet.balance.totalAmount,
      feeIncluded: this.txData.feeIncluded,
      fiatCode: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
      methodName: this.txData.sendMethod.type == SendMethodType.Easy ? 'MeritMoney Link' : 'Classic Send',
      destination: this.txData.sendMethod.alias ? '@' + this.txData.sendMethod.alias : this.txData.sendMethod.value
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

  sendAllowed() {
    return this.txData && !_.isEmpty(this.txData.txp);
  }


  async send() {
    const loadingSpinner = this.loadingCtrl.create({
      content: 'Sending transaction...',
      dismissOnPageChange: true
    });
    loadingSpinner.present();

    try {
      await this.sendService.send(this.txData, this.txData.wallet);

      if (this.txData.sendMethod.type == SendMethodType.Easy) {
        this.navCtrl.push('EasySendShareView', { txData: this.txData });
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
    let nameParts = contact.name.formatted.toUpperCase().replace(/\s\s+/g, ' ').split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
    return name;
  }

}

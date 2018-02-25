import { AlertController, IonicPage, LoadingController, NavController, NavParams, Tabs } from 'ionic-angular';
import { Component } from '@angular/core';
import { MeritToastController } from '@merit/mobile/app/core/toast.controller';
import { ToastConfig } from '@merit/mobile/app/core/toast.config';
import { ConfigService } from '@merit/mobile/app/shared/config.service';

import { WalletService } from '@merit/mobile/app/wallets/wallet.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { TouchIdService } from '@merit/mobile/app/shared/touch-id/touch-id.service';
import { EasySendService } from '@merit/mobile/app/transact/send/easy-send/easy-send.service';
import { TxFormatService } from '@merit/mobile/app/transact/tx-format.service';
import { EasySend } from '@merit/mobile/app/transact/send/easy-send/easy-send.model';
import * as  _ from 'lodash';
import { ISendMethod, SendMethodDestination, SendMethodType } from '@merit/mobile/app/transact/send/send-method.model';
import { RateService } from '@merit/mobile/app/transact/rate.service';
import { SendService } from '@merit/mobile/app/transact/send/send.service';
import { MeritWalletClient } from '../../../../lib/merit-wallet-client/index';


@IonicPage()
@Component({
  selector: 'view-send-confirmation',
  templateUrl: 'send-confirmation.html',
})
export class SendConfirmationView {

  // Statics
  private readonly CONFIRM_LIMIT_USD = 20;

  txData: {
    amount: number; // micros
    amountUSD: string; // micros
    totalAmount: number; // micros
    feeIncluded: boolean;
    password: string;
    recipient: {
      label: string;
      name: string;
      emails?: Array<{ value: string }>;
      phoneNumbers?: Array<{ value: string }>;
    };
    sendMethod: ISendMethod;
    txp: any;
    easySend?: EasySend;
    easySendUrl?: string;
    wallet: MeritWalletClient;
  };

  referralsToSign: Array<any>;
  viewData: any;

  unlockValue: number = 0;

  constructor(navParams: NavParams,
              private navCtrl: NavController,
              private toastCtrl: MeritToastController,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private touchIdService: TouchIdService,
              private easySendService: EasySendService,
              private walletService: WalletService,
              private formatService: TxFormatService,
              private rateService: RateService,
              private configService: ConfigService,
              private logger: Logger,
              private tabs: Tabs,
              private sendService: SendService
  ) {
    this.txData = navParams.get('txData');
    this.referralsToSign = navParams.get('referralsToSign');
  }

  async ngOnInit() {
    this.txData.amountUSD = await this.formatService.formatToUSD(this.txData.amount);

    const viewData: any = {
      recipient: this.txData.recipient,
      amountMrt: this.formatService.formatAmount(this.txData.amount),
      password: this.txData.password,
      feePercent: this.txData.txp.feePercent,
      feeAmountMrt: this.formatService.formatAmount(this.txData.txp.fee),
      totalAmountMrt: this.formatService.formatAmount(this.txData.totalAmount),
      walletName: this.txData.wallet.name || this.txData.wallet.id,
      walletColor: this.txData.wallet.color,
      walletCurrentBalanceMrt: this.formatService.formatAmount(this.txData.wallet.status.totalBalanceMicros),
      walletRemainingBalanceMrt: this.formatService.formatAmount(
        this.txData.wallet.status.totalBalanceMicros - this.txData.totalAmount
      ),
      feeIncluded: this.txData.feeIncluded,
      fiatCode: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
      methodName: this.txData.sendMethod.type == SendMethodType.Easy ? 'Easy Send' : 'Classic Send',
      destination: this.txData.sendMethod.alias || this.txData.sendMethod.value
    };

    let fiatAvailale = this.rateService.getRate(viewData.fiatCode) > 0;
    const convert = amount => fiatAvailale ? this.formatService.toFiatStr(amount, viewData.fiatCode) : '';

    viewData.amountFiat = await convert(this.txData.amount);
    viewData.feeAmountFiat = await convert(this.txData.txp.fee);
    viewData.totalAmountFiat = await convert(this.txData.totalAmount);
    viewData.walletCurrentBalanceFiat = await convert(this.txData.wallet.status.totalBalanceMicros);
    viewData.walletRemainingBalanceFiat = await convert(
      this.txData.wallet.status.totalBalanceMicros - this.txData.totalAmount
    );

    this.viewData = viewData;
  }

  sendAllowed() {
    return this.txData && !_.isEmpty(this.txData.txp);
  }

  approve() {
    let showPassPrompt = (highlightInvalid = false) => {
      this.alertController
        .create({
          title: 'Enter spending password',
          cssClass: highlightInvalid ? 'invalid-input-prompt' : '',
          inputs: [
            {
              name: 'password',
              placeholder: 'Password',
              type: 'password',
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop();
              },
            },
            {
              text: 'Ok',
              handler: data => {
                if (!data.password) {
                  showPassPrompt(true);
                } else {
                  this.walletService
                    .decrypt(this.txData.wallet, data.password)
                    .then(() => {
                      this.send();
                    })
                    .catch(err => {
                      showPassPrompt(true);
                    });
                }
              },
            },
          ],
        })
        .present();
    };

    let showNoPassPrompt = () => {
      this.alertController
        .create({
          title: 'Confirm Send',
          subTitle: 'Are you sure that you want to proceed with this transaction?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop();
              },
            },
            {
              text: 'Ok',
              handler: () => {
                this.send();
              },
            },
          ],
        })
        .present();
    };

    let showTouchIDPrompt = () => {
      // TODO check if we need this
      //this.alertController.create({
      //  title: 'TouId required',
      //  subTitle: 'Confirm transaction by your fingerprint',
      //  buttons: [
      //      { text: 'Cancel', role: 'cancel',handler: () => { this.navCtrl.pop(); } }
      //  ]
      //}).present();

      this.touchIdService
        .check()
        .then(() => {
          return this.send();
        })
        .catch(() => {
          this.navCtrl.pop();
        });
    };

    if (this.walletService.isEncrypted(this.txData.wallet)) {
      return showPassPrompt();
    } else {
      if (parseInt(this.txData.amountUSD) >= this.CONFIRM_LIMIT_USD) {
        if (this.touchIdService.isAvailable()) {
          return showTouchIDPrompt();
        } else {
          return showNoPassPrompt();
        }
      }
    }
  }


  private async send() {
    const loadingSpinner = this.loadingCtrl.create({
      content: 'Sending transaction...',
      dismissOnPageChange: true,
    });
    loadingSpinner.present();

    try {
      if (this.referralsToSign) {
        await Promise.all(this.referralsToSign.map(this.txData.wallet.sendReferral.bind(this.txData.wallet)));
        await Promise.all(this.referralsToSign.map(referral => {
          return this.txData.wallet.sendInvite(referral.address, 1);
        }));
      }
      await this.approveTx();
      if (this.txData.sendMethod.type == SendMethodType.Easy) {
        await this.easySendService.storeEasySend(this.txData.wallet.id, this.txData.easySend);
        console.dir(this.txData.easySendUrl);
        switch (this.txData.sendMethod.destination) {
          case SendMethodDestination.Sms:
            await this.easySendService.sendSMS(
              _.get(this.txData.recipient.phoneNumbers, '[0].value'),
              this.viewData.amountMrt,
              this.txData.easySendUrl
            );
            break;

          case SendMethodDestination.Email:
            await this.easySendService.sendEmail(
              _.get(this.txData.recipient.emails, '[0].value'),
              this.viewData.amountMrt,
              this.txData.easySendUrl
            );
            break;

          default:
            throw new Error(`Unsupported sending method: ${this.txData.sendMethod}`);
        }
      }

      this.navCtrl.popToRoot();
      this.toastCtrl.create({
        message: 'Your transaction is complete',
        cssClass: ToastConfig.CLASS_SUCCESS
      }).present();
    } catch (err) {
      this.logger.warn(err);
      return this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR,
      }).present();
    } finally {
      loadingSpinner.dismiss();
      this.referralsToSign = [];
    }
  }

  private approveTx() {
    if (!this.txData.wallet.canSign() && !this.txData.wallet.isPrivKeyExternal()) {
      this.logger.info('No signing proposal: No private key');
      return this.walletService.onlyPublish(this.txData.wallet, this.txData.txp, _.noop);
    } else {
      return this.walletService.publishAndSign(this.txData.wallet, this.txData.txp, _.noop);
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

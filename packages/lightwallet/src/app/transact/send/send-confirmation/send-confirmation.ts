import { AlertController, IonicPage, LoadingController, NavController, NavParams, Tabs } from 'ionic-angular';
import { Component } from '@angular/core';
import { MeritToastController } from 'merit/core/toast.controller';
import { ToastConfig } from 'merit/core/toast.config';
import { ConfigService } from 'merit/shared/config.service';

import { WalletService } from 'merit/wallets/wallet.service';
import { Logger } from 'merit/core/logger';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { EasySend, getEasySendURL } from 'merit/transact/send/easy-send/easy-send.model';
import * as  _ from 'lodash';
import { SendMethod } from 'merit/transact/send/send-method.model';


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
      email?: string;
      phoneNumber?: string;
    };
    sendMethod: SendMethod;
    txp: any;
    easySend?: EasySend;
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
              private configService: ConfigService,
              private logger: Logger,
              private tabs: Tabs
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
      methodName: this.txData.sendMethod.type == SendMethod.TYPE_EASY ? 'Easy Send' : 'Classic Send',
      destination: this.txData.sendMethod.value
    };

    const convert = amount => this.formatService.toFiatStr(amount, viewData.fiatCode);

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
      }
      await this.approveTx();
      if (this.txData.sendMethod.type == SendMethod.TYPE_EASY) {
        await this.easySendService.storeEasySend(this.txData.wallet.id, this.txData.easySend);

        switch (this.txData.sendMethod.destination) {
          case SendMethod.DESTINATION_SMS:
            return this.easySendService.sendSMS(
              this.txData.recipient.phoneNumber,
              this.viewData.amountMrt,
              getEasySendURL(this.txData.easySend)
            );

          case SendMethod.DESTINATION_EMAIL:
            return this.easySendService.sendEmail(
              this.txData.recipient.email,
              this.viewData.amountMrt,
              getEasySendURL(this.txData.easySend)
            );

          default:
            throw new Error(`Unsupported sending method: ${this.txData.sendMethod}`);
        }
      }
      this.navCtrl.setRoot('WalletsView');
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


import * as  _  from 'lodash';

import { NavController, NavParams, IonicPage, AlertController, ModalController, App, LoadingController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { ConfigService } from "merit/shared/config.service";

import { WalletService } from 'merit/wallets/wallet.service';
import { Logger } from 'merit/core/logger';
import { TouchIdService } from 'merit/shared/touch-id/touch-id.service';
import { EasySendService } from 'merit/transact/send/easy-send/easy-send.service';
import { TxFormatService } from "merit/transact/tx-format.service";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';


/**
 * The confirm view is the final step in the transaction sending process
 * (for single-signature wallets).
 */
@IonicPage()
@Component({
  selector: 'send-confirm-view',
  templateUrl: 'send-confirm.html',
})
export class SendConfirmView {
  // Statics
  private static CONFIRM_LIMIT_USD = 20;

  private txData: {
    amount: number; // micros
    amountUSD: string; // micros
    totalAmount: number; // micros
    feeIncluded: boolean;
    recipient: {
      sendMethod: string;
      label: string;
      name: string;
      email?: string;
      phoneNumber?: string;
    };
    txp: any;
    easySendURL: string;
    wallet: MeritWalletClient;
  };
  private referralsToSign: Array<any>;
  private viewData;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private toastCtrl: MeritToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private app: App,
    private touchIdService: TouchIdService,
    private easySendService: EasySendService,
    private walletService: WalletService,
    private formatService: TxFormatService,
    private configService: ConfigService,
    private logger: Logger
  ) {
    this.logger.info('Hello SendConfirm View');
  }

  async ionViewDidLoad() {
    this.txData = this.navParams.get('txData');
    this.txData.amountUSD = await this.formatService.formatToUSD(this.txData.amount);
    this.referralsToSign = this.navParams.get('referralsToSign');

    this.viewData = {
      recipientName: this.txData.recipient.label,
      amountMrt: this.formatService.formatAmount(this.txData.amount),
      feePercent: this.txData.txp.feePercent,
      feeAmountMrt: this.formatService.formatAmount(this.txData.txp.fee),
      totalAmountMrt: this.formatService.formatAmount(this.txData.totalAmount),
      walletName: this.txData.wallet.name || this.txData.wallet.id,
      walletCurrentBalanceMrt: this.formatService.formatAmount(this.txData.wallet.status.totalBalanceSat),
      walletRemainingBalanceMrt: this.formatService.formatAmount(
        this.txData.wallet.status.totalBalanceSat - this.txData.totalAmount
      ),
      feeIncluded: this.txData.feeIncluded,
      fiatCode: this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
    };

    let convert = amount => this.formatService.toFiatStr(amount, this.viewData.fiatCode);
    this.viewData.amountFiat = await convert(this.txData.amount);
    this.viewData.feeAmountFiat = await convert(this.txData.txp.fee);
    this.viewData.totalAmountFiat = await convert(this.txData.totalAmount);
    this.viewData.walletCurrentBalanceFiat = await convert(this.txData.wallet.status.totalBalanceSat);
    this.viewData.walletRemainingBalanceFiat = await convert(
      this.txData.wallet.status.totalBalanceSat - this.txData.totalAmount
    );
  }

  public sendAllowed() {
    return this.txData && !_.isEmpty(this.txData.txp);
  }

  public approve() {
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
      if (parseInt(this.txData.amountUSD) >= SendConfirmView.CONFIRM_LIMIT_USD) {
        if (this.touchIdService.isAvailable()) {
          return showTouchIDPrompt();
        } else {
          return showNoPassPrompt();
        }
      }
    }
  }

    private async send() {
        let loadingSpinner = this.loadingCtrl.create({
            content: 'Sending transaction...',
            dismissOnPageChange: true,
        });
        loadingSpinner.present();

        const sendReferrals = Promise.all(this.referralsToSign.map(this.txData.wallet.sendReferral.bind(this.txData.wallet)));

        try {
            await sendReferrals;
            await this.approveTx();
            if (this.txData.recipient.sendMethod == 'sms') {
                return this.easySendService.sendSMS(
                    this.txData.recipient.phoneNumber,
                    this.viewData.amountMrt,
                    this.txData.easySendURL
                );
            } else if (this.txData.recipient.sendMethod == 'email') {
                return this.easySendService.sendEmail(
                    this.txData.recipient.email,
                    this.viewData.amountMrt,
                    this.txData.easySendURL
                );
            }
            this.navCtrl.push('WalletsView');
        }
        catch (err) {
            return this.toastCtrl
                .create({
                    message: err,
                    cssClass: ToastConfig.CLASS_ERROR,
                })
                .present();
        }
        finally {
            loadingSpinner.dismiss();
            this.referralsToSign = [];
        }

    }

    private approveTx(): Promise<void> {
        if (!this.txData.wallet.canSign() && !this.txData.wallet.isPrivKeyExternal()) {
            this.logger.info('No signing proposal: No private key');
            return this.walletService.onlyPublish(this.txData.wallet, this.txData.txp, _.noop);
        } else {
            return this.walletService.publishAndSign(this.txData.wallet, this.txData.txp, _.noop);
        }
    }
}
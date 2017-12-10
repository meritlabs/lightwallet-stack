import * as  _  from 'lodash';
import * as Promise from 'bluebird';

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

  private txData;
  private viewData;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private toastCtrl:MeritToastController,
    private alertController:AlertController,
    private loadingCtrl: LoadingController,
    private app:App,
    private touchIdService:TouchIdService,
    private easySendService: EasySendService,
    private walletService:WalletService,
    private formatService:TxFormatService,
    private configService:ConfigService,
    private logger:Logger
  ) {
    this.logger.info("Hello SendConfirm View");
  }

  async ionViewDidLoad() {
    /**
     * txData
     *      txp
     *      wallet
     *      amount (micros)
     *      feeAmount (micros)
     *      totalAmount (micros)
     *      recipient
     *        sendMethod (address|sms|string)
     *        name
     *        address
     *        phoneNumber
     *        email
     */
    this.txData    = this.navParams.get('txData');
    this.txData.amountUSD = await this.formatService.formatToUSD(this.txData.amount);


    this.viewData = {
      recipientName: this.txData.recipient.label,
      amountMrt: this.formatService.formatAmount(this.txData.amount),
      feePercent: this.txData.txp.feePercent,
      feeAmountMrt: this.formatService.formatAmount(this.txData.txp.fee),
      totalAmountMrt: this.formatService.formatAmount(this.txData.totalAmount),
      walletName: this.txData.wallet.name || this.txData.wallet.id,
      walletCurrentBalanceMrt: this.formatService.formatAmount(this.txData.wallet.status.totalBalanceSat),
      walletRemainingBalanceMrt: this.formatService.formatAmount(this.txData.wallet.status.totalBalanceSat - this.txData.totalAmount),
      feeIncluded: this.txData.feeIncluded
    };

    let fiatCode = this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase();
    let convert = amount => this.formatService.toFiat(amount, fiatCode);
    this.viewData.amountFiat = await convert(this.txData.amount);
    this.viewData.feeAmountFiat = await convert(this.txData.txp.fee);
    this.viewData.totalAmountFiat = await convert(this.txData.totalAmount);
    this.viewData.walletCurrentBalanceFiat = await convert(this.txData.wallet.status.totalBalanceSat);
    this.viewData.walletRemainingBalanceFiat = await convert(this.txData.wallet.status.totalBalanceSat - this.txData.totalAmount);

  }


  public sendAllowed() {
    return (
      this.txData && !_.isEmpty(this.txData.txp)
    );
  }

  public approve() {

    let showPassPrompt = (highlightInvalid = false) => {

      this.alertController.create({
        title: 'Enter spending password',
        cssClass: highlightInvalid ? 'invalid-input-prompt' : '',
        inputs: [{
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }],
        buttons: [
          { text: 'Cancel', role: 'cancel',handler: () => { this.navCtrl.pop();}  },
          { text: 'Ok', handler: (data) => {
            if (!data.password) {
              showPassPrompt(true);
            } else {
              return this.walletService.decrypt(this.txData.wallet,  data.password).then(() => {
                return this.send();
              }).catch((err) => { showPassPrompt(true) })
            }
          }
          }
        ]
      }).present();

    };

    let showNoPassPrompt = () => {

      this.alertController.create({
        title: 'Confirm sending amount',
        subTitle: 'Your wallet is not secure by password. We highly recommend you to add spending password in wallet settings. Process current sending?',
        buttons: [
          { text: 'Cancel', role: 'cancel',handler: () => { this.navCtrl.pop();}  },
          { text: 'Ok', handler: () => {
            return this.send();
          }}
        ]
      }).present();

    };

    let showTouchIDPrompt = () => {
      //todo implement
      return this.send();
    };

    if (this.walletService.isEncrypted(this.txData.wallet)) {
      return showPassPrompt();
    } else {
      if (this.txData.amountUSD >= SendConfirmView.CONFIRM_LIMIT_USD) {
        if (this.touchIdService.isAvailable()) {
          return showTouchIDPrompt();
        } else {
          return showNoPassPrompt();
        }
      }
    }

  }

  private send() {
    let loadingSpinner = this.loadingCtrl.create({
      content: "Sending transaction...",
      dismissOnPageChange: true
    });
    loadingSpinner.present();

    return this.approveTx().then(() => {

      if (this.txData.recipient.sendMethod == 'sms') {
        return this.easySendService.sendSMS(this.txData.recipient.phoneNumber, this.txData.easySendURL);
      } else if (this.txData.recipient.sendMethod == 'email') {
        return this.easySendService.sendEmail(this.txData.recipient.email, this.txData.easySendURL);
      } else {
        return Promise.resolve()
      }
    }).then(() => {
      loadingSpinner.dismiss();
      return this.app.getRootNavs[0].setRoot('TransactView');
    }).catch((err) => {
      loadingSpinner.dismiss();
      return this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });

  }

  private approveTx():Promise<void> {

      return this.walletService.createTx(this.txData.wallet, this.txData.txp).then((ctxp) => {

        if (!this.txData.wallet.canSign() && !this.txData.wallet.isPrivKeyExternal()) {
          this.logger.info('No signing proposal: No private key');
          return this.walletService.onlyPublish(this.txData.wallet, this.txData.txp, _.noop);
        } else {
          return this.walletService.publishAndSign(this.txData.wallet, this.txData.txp, _.noop)
        }

      });
  }

}

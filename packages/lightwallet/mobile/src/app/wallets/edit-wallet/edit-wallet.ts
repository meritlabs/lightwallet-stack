import { Component } from '@angular/core';
import { AlertController, App, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';

@IonicPage()
@Component({
  selector: 'view-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletView {
  wallet: MeritWalletClient;

  isWalletEncrypted: boolean;

  constructor(
    private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private profileService: ProfileService,
              private app: App,
              private toastCtrl: MeritToastController,
              private configService: ConfigService,
              private walletService: WalletService,
              private logger: LoggerService
  ) {
    this.wallet = this.navParams.get('wallet');
    this.isWalletEncrypted = this.walletService.isEncrypted(this.wallet);
    this.logger.info(this.wallet);
  }

  changeBalanceHidden(isHidden) {
    this.wallet.balanceHidden = isHidden;
    this.walletService.setHiddenBalanceOption(this.wallet.id, isHidden);
  }

  changeName(name) {
    if (name) {
      let aliasOpts = { aliasFor: {} };
      aliasOpts.aliasFor[this.wallet.id] = name;

      this.wallet.credentials.walletName = name;

      return this.configService.set(aliasOpts);
    }
  }

  changeColor() {
    let modal = this.modalCtrl.create('SelectColorView', { color: this.wallet.color });
    modal.onDidDismiss((color) => {
      if (color) {
        this.wallet.color = color;
        let colorOpts = { colorFor: {} };
        colorOpts.colorFor[this.wallet.id] = color;
        this.configService.set(colorOpts);
      }
    });
    modal.present();
  }

  goToSetPassword() {
    this.navCtrl.push('SetWalletPasswordView', { wallet: this.wallet });
    //this.walletService.encrypt(wallet, this.formData.password);
  }

  goToExportWallet() {
    this.navCtrl.push('ExportWalletView', { wallet: this.wallet });
  }

  deleteWallet() {

    this.alertCtrl.create({
      title: 'WARNING!',
      message: 'This action will permanently delete this wallet. IT CANNOT BE REVERSED!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.profileService.deleteWallet(this.wallet).then(() => {
              this.profileService.isAuthorized().then((authorized) => {
                if (authorized) {
                  this.navCtrl.popToRoot();
                } else {
                  this.navCtrl.setRoot('OnboardingView');
                }
              })
            }).catch((err) => {
              this.toastCtrl.create({
                message: JSON.stringify(err),
                cssClass: ToastConfig.CLASS_ERROR
              });
            });
          }
        }
      ]
    }).present();
  }
}

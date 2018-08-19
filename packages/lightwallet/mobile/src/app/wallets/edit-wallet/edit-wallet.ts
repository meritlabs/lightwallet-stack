import { Component } from '@angular/core';
import { App, IonicPage, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { DisplayWallet } from '../../../../../common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletView {
  wallet: DisplayWallet;

  isWalletEncrypted: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private profileService: ProfileService,
    private app: App,
    private toastCtrl: ToastControllerService,
    private configService: ConfigService,
    private walletService: WalletService,
    private logger: LoggerService
  ) {
    this.wallet = this.navParams.get('wallet');
    this.logger.info(this.wallet);
  }

  ionViewWillEnter() {
    this.isWalletEncrypted = this.walletService.isWalletEncrypted(this.wallet.client);
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
            if (!this.walletService.isWalletEncrypted(this.wallet.client)) {
              this.doDeleteWallet();
            } else {
              this.showPasswordPrompt();
            }
          }
        }
      ]
    }).present();
  }

  private showPasswordPrompt(highlightInvalid = false) {
    this.alertCtrl
      .create({
        title: 'Enter wallet password',
        cssClass: highlightInvalid ? 'invalid-input-prompt' : '',
        inputs: [ { name: 'password', placeholder: 'Password', type: 'password'} ],
        buttons: [ { text: 'Cancel',role: 'cancel', },{
            text: 'Ok',
            handler: data => {
              if (!data.password) {
                this.showPasswordPrompt(true);
              } else {
                try {
                  this.walletService.decryptWallet(this.wallet.client, data.password);
                  this.doDeleteWallet();
                } catch (e) {
                  this.showPasswordPrompt(true);
                }
              }
            },
          },
        ],
      })
      .present();
  }

  private doDeleteWallet() {

    this.profileService.deleteWallet(this.wallet.client).then(() => {
      this.profileService.isAuthorized().then((authorized) => {
        if (authorized) {
          this.navCtrl.popToRoot();
        } else {
          const nav = this.app.getRootNavs()[0];
          nav.setRoot('OnboardingView');
          nav.popToRoot();
        }
      })
    }).catch((err) => {
      this.toastCtrl.error(JSON.stringify(err));
    });
  }
}

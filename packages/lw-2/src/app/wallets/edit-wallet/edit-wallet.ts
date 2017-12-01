import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, App } from 'ionic-angular';
import { ProfileService } from "merit/core/profile.service";
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import { ConfigService } from "merit/shared/config.service";
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';


@IonicPage()
@Component({
  selector: 'view-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletView {

  public wallet:any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl:ModalController,
    private alertCtrl:AlertController,
    private profileService:ProfileService,
    private app:App,
    private toastCtrl:MeritToastController,
    private configService:ConfigService,
    private walletService:WalletService,
    private logger: Logger
  ) {
      this.wallet = this.navParams.get('wallet');
      this.logger.info(this.wallet);
  }

  changeBalanceHidden(isHidden) {
    this.wallet.balanceHidden = isHidden;
    this.walletService.setHiddenBalanceOption(this.wallet.id, isHidden);
  }

  changeName(name) {
    if (name) {
      let aliasOpts = {aliasFor: {}};
      aliasOpts.aliasFor[this.wallet.id] = name;
      this.configService.set(aliasOpts);
    }
  }

  changeColor() {
    let modal = this.modalCtrl.create('SelectColorView', {color: this.wallet.color});
    modal.onDidDismiss((color) => {
      if (color) {
        this.wallet.color = color;
        let colorOpts = {colorFor: {}};
        colorOpts.colorFor[this.wallet.id] = color;
        this.configService.set(colorOpts);
      }
    });
    modal.present();
  }

  goToSetPassword() {
    this.navCtrl.push('SetWalletPasswordView', {wallet: this.wallet});
    //this.walletService.encrypt(wallet, this.formData.password);
  }

  goToExportWallet() {
    this.navCtrl.push('ExportWalletView', {wallet: this.wallet});
  }

  deleteWallet() {

    this.alertCtrl.create({
      title: 'WARNING!',
      message: 'This action will permanently delete this wallet. IT CANNOT BE REVERSED!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Delete',
          handler: () => {
            this.profileService.deleteWalletClient(this.wallet).then(() => {
              this.app.getRootNav().setRoot('WalletsView');
            }).catch((err) => {
              this.toastCtrl.create({
                message: JSON.stringify(err),
                cssClass: ToastConfig.CLASS_ERROR
              })
            });
          }
        }
      ]
    }).present();
  }


}

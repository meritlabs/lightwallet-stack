import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RateService } from "merit/transact/rate.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';

@IonicPage()
@Component({
  selector: 'view-create-vault-confirm',
  templateUrl: 'create-vault-confirm.html',
})
export class CreateVaultConfirmView {

  private vaultData;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private toastCtrl: MeritToastController,
    private createVaultService: CreateVaultService,
    private loadingCtrl: LoadingController
  ) {
    this.vaultData = this.navParams.get('vaultData');
  }

  create() {
    //todo change text
    this.alertCtrl.create({
      title: 'Did you write your recovery phrase down?',
      message: 'It is necessary to keep your money save ',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'Yes', handler: () => { this.createVault(); }}
      ]
    }).present();
  }

  private async createVault() {

    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();
    try {
      await this.createVaultService.create(this.vaultData);
      this.navCtrl.popToRoot({});
    } catch (e) {
      this.toastCtrl.create({
        message: e.message || 'Failed to create vault',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } finally  {
      loader.dismiss();
    }

  }

}

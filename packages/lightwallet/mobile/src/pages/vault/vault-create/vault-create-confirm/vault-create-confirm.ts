import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RateService } from "@merit/common/services/rate.service";
import { IVaultCreateData, VaultsService } from "@merit/common/services/vaults.service";
import { ToastConfig, MeritToastController } from '@merit/common/services/toast.controller.service';
import { IDisplayWallet } from "@merit/common/models/display-wallet";

@IonicPage()
@Component({
  selector: 'view-vault-create-confirm',
  templateUrl: 'vault-create-confirm.html',
})
export class VaultCreateConfirmView {

  private vaultData: IVaultCreateData;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private toastCtrl: MeritToastController,
    private vaultsService: VaultsService,
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
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes', handler: () => { this.createVault(); }}
      ]
    }).present();
  }

  private async createVault() {

    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();
    try {
      await this.vaultsService.createVault(this.vaultData);
      this.navCtrl.popToRoot();
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

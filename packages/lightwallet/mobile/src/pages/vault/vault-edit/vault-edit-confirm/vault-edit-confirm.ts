import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { VaultsService } from "@merit/common/services/vaults.service";
import { ToastConfig, MeritToastController } from '@merit/common/services/toast.controller.service';

@IonicPage()
@Component({
  selector: 'view-vault-edit-confirm',
  templateUrl: 'vault-edit-confirm.html',
})
export class VaultEditConfirmView {

  private vaultData;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private vaultsService: VaultsService,
    private toastCtrl: MeritToastController
  ) {
    this.vaultData = this.navParams.get('vaultData');
  }

  save() {

    this.alertCtrl.create({
      title: 'Renew Vault?',
      message: 'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'Yes', handler: () => { this.editVault(); }}
      ]
    }).present();
  }

  private async editVault() {

    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();
    try {
      this.vaultData.vault.name = this.vaultData.vaultName;
      this.vaultData.vault.whitelist = this.vaultData.whitelist;
      await this.vaultsService.editVault(this.vaultData.vault, this.vaultData.masterKey);
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

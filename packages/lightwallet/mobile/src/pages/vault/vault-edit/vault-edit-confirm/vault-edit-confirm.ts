import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { VaultsService } from "@merit/common/services/vaults.service";
import { ToastConfig, MeritToastController } from '@merit/common/services/toast.controller.service';

import { ENV } from '@app/env';

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

  save(highlightInvalidInput = false, previousValue = '') {

    console.log(previousValue);

    this.alertCtrl.create({
      title: 'Renew Vault?',
      message: 'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?',
      cssClass: highlightInvalidInput ? 'invalid-input-prompt' : '',
      inputs: [{
        value: previousValue,
        name: 'phrase',
        placeholder: 'Enter phrase you received on vault creation'
      }],
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'Yes', handler: (value) => { this.editVault(value.phrase); }}
      ]
    }).present();
  }

  private async editVault(phrase) {

    let xMasterKey;
    try {
      const masterKeyMnemonic = this.vaultData.vault.walletClient.getNewMnemonic(phrase.replace(/\s\s+/g, ' ').trim().toLowerCase());
      xMasterKey = masterKeyMnemonic.toHDPrivateKey('', ENV.network);
    } catch (ex) {
      return this.save(true, phrase);
    }

    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();
    try {
      this.vaultData.vault.name = this.vaultData.vaultName;
      this.vaultData.vault.whitelist = this.vaultData.whitelist;
      this.vaultData.vault.masterKey = this.vaultData.masterKey.key;
      await this.vaultsService.editVault(this.vaultData.vault, xMasterKey);
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

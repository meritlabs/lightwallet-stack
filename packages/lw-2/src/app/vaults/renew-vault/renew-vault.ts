import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { PopupService } from "merit/core/popup.service";


@IonicPage({
  segment: 'vault/:vaultId/renew',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'view-renew',
  templateUrl: 'renew-vault.html',
})
export class VaultRenewView {
  
  public formData = { vaultName: '' };

  constructor(
    private navCtrl:NavController,
    private popupService: PopupService,
  ){}

  ionViewDidLoad() {
    this.formData.vaultName = '';
  }

  confirmRenew() {
    this.popupService.ionicConfirm(
        'Reset vault?', 
        'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?', 
        'Yes', 
        'No').then(() => this.toVault());
  }

  toVault() {
      console.log('to vault');
  }
}
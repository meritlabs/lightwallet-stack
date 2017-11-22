import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from "merit/core/popup.service";
import * as Promise from 'bluebird';

@IonicPage({
  segment: 'vault/:vaultId/renew',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'view-renew',
  templateUrl: 'renew-vault.html',
})
export class VaultRenewView {

  public vault: any;
  
  public formData = { vaultName: '' };

  constructor(
    private navCtrl:NavController,
    public navParams: NavParams,
    private popupService: PopupService,
  ){
    this.vault = this.navParams.get('vault');
  }

  ionViewDidLoad() {
    this.formData.vaultName = '';
  }

  confirmRenew() {
    this.popupService.ionicConfirm(
        'Reset vault?', 
        'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?', 
        'Yes', 
        'No').then((result: boolean) => {
          if (result) this.toVault();
          return;
        });
  }

  toVault() {
      return new Promise((resolve, reject) => {
        resolve(true);
      }).then(() => {
        this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
        return;
      })
  }
}
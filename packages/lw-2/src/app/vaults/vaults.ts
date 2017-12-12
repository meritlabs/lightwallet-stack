import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';


@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {
  @Input() vaults = [];

  constructor(
    private navCtrl: NavController,
    private vaultService: VaultsService,
  ){}

  toAddVault() {
    this.navCtrl.push('CreateVaultGeneralInfoView');
  }

  toVault(vault) {
    this.navCtrl.push('VaultDetailsView', { vaultId: vault._id, vault: vault });
  }
}

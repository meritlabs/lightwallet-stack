import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';


@IonicPage()
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {
  @Input() vaults = [];

  constructor(
    private navCtrl:NavController,
    private vaultService: VaultsService,
  ){}

  toAddWallet() {
    this.navCtrl.push('CreateVaultView');
  }

  toVault(vault) {
    console.log('toVault', vault);
  }
}
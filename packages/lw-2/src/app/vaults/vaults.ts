import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';


@IonicPage()
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {
  public vaults = [];

  constructor(
    private navCtrl:NavController,
    private vaultService: VaultsService,
  ){}

  ionViewDidLoad() {
    this.vaultService.getVaults().then((vaults) => {
      this.vaults = vaults;
    });
  }

  toAddWallet() {
    this.navCtrl.push('CreateVaultView');
  }
}
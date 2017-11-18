import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { ProfileService } from 'merit/core/profile.service';


@IonicPage()
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {
  public vaults = [];

  constructor(
    private navCtrl:NavController,
    private profileService: ProfileService,
    private vaultService: VaultsService,
  ){}

  ionViewDidLoad() {
    console.log('loading vaults block');
    this.vaults = this.vaultService.getVaultList();
  }

  toAddWallet() {
    this.navCtrl.push('CreateVaultView');
  }
}

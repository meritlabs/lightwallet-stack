import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {
  public vaults;

  constructor(
    private navCtrl:NavController,
  ){}

  toAddWallet() {
    this.navCtrl.push('CreateVaultView');
  }
}
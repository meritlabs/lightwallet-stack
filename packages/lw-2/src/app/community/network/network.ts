import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileService } from "merit/core/profile.service";
import { ModalController } from "ionic-angular/index";

// Network View 
// Part of the Community Tab.
@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  public wallets;
  public wallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileService:ProfileService,
    private modalCtrl:ModalController
  ) {

  }

  ionViewDidLoad() {
    //do something here
    this.wallets = this.profileService.getWallets();
    this.wallet = this.wallets[0];
  }


  selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
    });
  }

}

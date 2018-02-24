import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@IonicPage()
@Component({
  selector: 'view-select-wallet',
  templateUrl: 'select-wallet.html',
})
export class SelectWalletModal {

  wallets: MeritWalletClient[];
  selectedWallet: MeritWalletClient;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private profileService: ProfileService) {}

  async ngOnInit() {
    this.wallets = this.navParams.get('availableWallets') || await this.profileService.getWallets();
    this.selectedWallet = this.navParams.get('selectedWallet');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet) {
    if (wallet.confirmed) {
      this.viewCtrl.dismiss(wallet);
    }
  }

}

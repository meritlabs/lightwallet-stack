import { find, findIndex } from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@IonicPage()
@Component({
  selector: 'view-select-whitelist',
  templateUrl: 'select-whitelist.html',
})
export class SelectWhitelistModal {

  wallets: MeritWalletClient[];
  selectedWallets: MeritWalletClient[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private profileService: ProfileService) {}

  async ngOnInit() {
    this.wallets = this.navParams.get('availableWallets') || await this.profileService.getWallets();
    this.selectedWallets = this.navParams.get('selectedWallets');
  }

  checkWalletSelected(id) {
    return this.selectedWallets.some(w => w.id === id);
  }

  select(wallet: MeritWalletClient) {
    const selectedWalletIndex = findIndex(this.selectedWallets, { id: wallet.id });

    if (selectedWalletIndex === -1) {
      this.selectedWallets.push(wallet);
    } else {
      this.selectedWallets.splice(selectedWalletIndex, 1);
    }
  }

  close() {
    this.viewCtrl.dismiss(this.selectedWallets);
  }
}

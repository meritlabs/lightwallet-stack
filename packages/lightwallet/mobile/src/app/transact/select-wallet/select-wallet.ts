import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';

@IonicPage()
@Component({
  selector: 'view-select-wallet',
  templateUrl: 'select-wallet.html',
})
export class SelectWalletModal {
  wallets: MeritWalletClient[];
  selectedWallet: MeritWalletClient;

  showInvites: boolean;

  constructor(private navParams: NavParams, private viewCtrl: ViewController, private profileService: ProfileService) {}

  async ngOnInit() {
    this.wallets = this.navParams.get('availableWallets') || (await this.profileService.getWallets());
    this.selectedWallet = this.navParams.get('selectedWallet');
    this.showInvites = this.navParams.get('showInvites');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet) {
    this.viewCtrl.dismiss(wallet);
  }
}

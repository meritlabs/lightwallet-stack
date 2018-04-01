import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-select-invite-wallet',
  templateUrl: 'select-invite-wallet.html',
})
export class SelectInviteWalletModal {

  public wallets: Array<DisplayWallet>;
  public selectedWallet: DisplayWallet;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.wallets = this.navParams.get('availableWallets');
    this.selectedWallet = this.navParams.get('selectedWallet');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet: DisplayWallet) {
    if (wallet.availableInvites) {
      this.viewCtrl.dismiss(wallet);
    }
  }

}

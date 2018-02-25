import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { IDisplayWallet } from '@merit/common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-select-invite-wallet',
  templateUrl: 'select-invite-wallet.html',
})
export class SelectInviteWalletModal {

  public wallets: Array<IDisplayWallet>;
  public selectedWallet: IDisplayWallet;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.wallets = this.navParams.get('availableWallets');
    this.selectedWallet = this.navParams.get('selectedWallet');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet: IDisplayWallet) {
    if (wallet.invites) {
      this.viewCtrl.dismiss(wallet);
    }
  }

}

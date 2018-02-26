import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IDisplayWallet } from "merit/../models/display-wallet";

export interface IWhitelistWallet extends IDisplayWallet {
  selected: boolean;
}

@IonicPage()
@Component({
  selector: 'view-select-whitelist',
  templateUrl: 'select-whitelist.html',
})
export class SelectWhitelistModal {

  wallets: Array<IWhitelistWallet>;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.wallets = this.navParams.get('availableWallets');
  }

  close() {
    this.viewCtrl.dismiss(this.wallets);
  }
}

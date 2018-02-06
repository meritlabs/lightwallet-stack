import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IDisplayWallet } from 'src/models/display-wallet';
import { ProfileService } from 'merit/core/profile.service';


@IonicPage()
@Component({
  selector: 'view-select-invite-wallet',
  templateUrl: 'select-invite-wallet.html',
})
export class SelectInviteWalletModal {

  public wallets: Array<IDisplayWallet>;
  public selectedWallet: IDisplayWallet;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private profileService: ProfileService
  ) {
    this.wallets = this.navParams.get('wallets'); 
    this.selectedWallet = this.navParams.get('selectedWallet');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
  }

  select(wallet) {
    this.viewCtrl.dismiss(wallet);
  }

}

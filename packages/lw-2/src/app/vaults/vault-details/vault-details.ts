import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Logger } from 'merit/core/logger';


@IonicPage({
  segment: 'vault/:vaultId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'vault-details-view',
  templateUrl: 'vault-details.html',
})
export class VaultDetailsView {

  public vault: any;
  public whitelist: Array<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger:Logger  
  ) {
    // We can assume that the wallet data has already been fetched and 
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.vault = this.navParams.get('vault');
    this.whitelist = this.vault.whitelist;
    console.log("Inside the vault-details view.");
    console.log(this.vault);
  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log("Vault-Detail View Did Load.");
    console.log(this.vault);
    //do something here
  }
}

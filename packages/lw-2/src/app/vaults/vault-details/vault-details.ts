import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
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

  private bitcore:any;
  public vault: any;
  public whitelist: Array<any>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public vaultsService: VaultsService,
    public bwcService: BwcService,
    public profileService: ProfileService,
    private logger:Logger) {
    // We can assume that the wallet data has already been fetched and 
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.vault = this.navParams.get('vault');
    this.bitcore = bwcService.getBitcore();
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
    this.profileService.getHeadWalletClient().then((walletClient) => {
      this.vaultsService.getVaultCoins(walletClient, this.vault).then((coins) => {

        let address = this.bitcore.Address.fromObject(this.vault.address);

        console.log(address.toString());
        console.log(this.vault);
        console.log(coins);

        let network = walletClient.credentials.network;
        let dummyKey = this.bitcore.PrivateKey.fromRandom(network);

        let tx = walletClient.buildRenewVaultTx(coins, this.vault, dummyKey, {network: network});

        console.log("RENEW TX");
        console.log(tx);
        console.log(tx.serialize());
      });
    });
  }
}

import * as _ from "lodash";
import * as Promise from 'bluebird'; 

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { Logger } from 'merit/core/logger';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { IMeritWalletClient } from 'src/lib/merit-wallet-client';


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
  public whitelist: Array<any> = [];
  public coins: Array<any> = [];
  private bitcore: any = null;
  private walletClient: IMeritWalletClient;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger:Logger,
    private profileService: ProfileService,
    private walletService: WalletService,
    private vaultsService: VaultsService,
    private bwc: BwcService,
  ) {
    // We can assume that the wallet data has already been fetched and 
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
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

    Promise.all([
      this.getAllWallets().then((wallets) => {
        return _.map(wallets, (w) => {
          const name = w.name || w._id;
          return { 'id': w.id, 'name': name, 'pubKey': w.credentials.xPubKey, 'type': 'wallet' };
        });


        
      }), 
      // fetch users vaults
      this.getAllWVaults().then((vaults) => {
        return _.map(vaults, (v) => {
          const name = v.name || v._id;
          const key = new this.bitcore.Address(v.address).toString();
          return { 'id': v._id, 'name': name, 'pubKey': key, 'type': 'vault' }; 
        });
      }),
      // fetch coins
    ]).then((arr: Array<Array<any>>) => {
      const whitelistCandidates = _.flatten(arr);
      _.each(this.vault.whitelist, (wl) => {
        const found = _.find(whitelistCandidates, { pubKey: wl });
        if (found) {
          this.whitelist.push(found);
        }
      });
    });
  }

  toResetVault() {
    this.navCtrl.push('VaultRenewView', { vaultId: this.vault._id, vault: this.vault });
  }

  private getAllWallets(): Promise<Array<any>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      return Promise.all(_.map(ws, async (wallet:any) => {
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet; 
      }));
    })
    return wallets;
  }

  private getAllWVaults(): Promise<Array<any>> {
    return this.profileService.getWallets().then((ws) => {
      if (_.isEmpty(ws)) {
        Promise.resolve(null); //ToDo: add proper error handling;
      }
      return _.head(ws);
    }).then((walletClient) => {
      this.walletClient = walletClient;
      return this.vaultsService.getVaults(walletClient);
    });
  }
}

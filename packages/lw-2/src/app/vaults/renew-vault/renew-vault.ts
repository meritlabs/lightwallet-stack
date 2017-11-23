import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from "merit/core/popup.service";
import * as Promise from 'bluebird';
import { WalletService } from 'merit/wallets/wallet.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { IMeritWalletClient } from 'src/lib/merit-wallet-client';

@IonicPage({
  segment: 'vault/:vaultId/renew',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'view-renew',
  templateUrl: 'renew-vault.html',
})
export class VaultRenewView {

  public vault: any;
  public formData = { vaultName: '', masterKey: '', whitelist: [] };
  public whitelistCandidates: Array<any> = [];
  private bitcore: any = null;
  private walletClient: IMeritWalletClient;

  constructor(
    private navCtrl:NavController,
    public navParams: NavParams,
    private popupService: PopupService,
    private bwc: BwcService,  
    private walletService: WalletService,
    private vaultsService: VaultsService,  
    private profileService: ProfileService,
  ){
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
  }

  async ionViewDidLoad() {
    await this.updateWhitelist();
    this.formData.vaultName = this.vault.name;
    this.formData.masterKey = '';
  }

  confirmRenew() {
    this.popupService.ionicConfirm(
        'Reset vault?', 
        'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?', 
        'Yes', 
        'No').then((result: boolean) => {
          if (result) this.toVault();
          return;
        });
  }

  toVault() {
      return new Promise((resolve, reject) => {
        resolve(true);
      }).then(() => {
        this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
        return;
      })
  }

  regenerateMasterKey() {
    let network = this.walletClient.credentials.network || 'testnet';
    let masterKey = this.bitcore.PrivateKey.fromRandom(network);
    let masterKeyMnemonic = this.walletClient.getNewMnemonic(masterKey.toBuffer());

    this.formData.masterKey = masterKey;

    this.popupService.ionicAlert(
        'Master key',
        masterKeyMnemonic,
        'I copied the Master Key.'
    );
  }

  compareWhitelistEntries(e1: any, e2: any): boolean {
    const result =  e1.type == e2.type && e1.id == e2.id;
    console.log('result', result, e1, e2);
    return result;
  }

  private updateWhitelist(): Promise<any> {
    return Promise.all([
      // fetch users wallets
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
    ]).then((arr: Array<Array<any>>) => {
      const whitelistCandidates = _.flatten(arr);
      this.whitelistCandidates = whitelistCandidates;
      _.each(this.vault.whitelist, (wl) => {
        const found = _.find(whitelistCandidates, { pubKey: wl });
        if (found) {
          this.formData.whitelist.push(found);
        }
      });
      console.log(this.whitelistCandidates, this.formData.whitelist);
    });
  }

  private getAllWallets(): Promise<Array<any>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      this.walletClient = _.head(ws);
      return Promise.all(_.map(ws, async (wallet:any) => {
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet; 
      }));
    })
    return wallets;
  }

  private getAllWVaults(): Promise<Array<any>> {
    return this.profileService.getWallets().then((ws: any[]) => {
      if (_.isEmpty(ws)) {
        Promise.reject(new Error('getAllWVaults failed')); //ToDo: add proper error handling;
      }
      return _.head(ws);
    }).then((walletClient) => {
      this.walletClient = walletClient;
      return this.vaultsService.getVaults(walletClient);
    });
  }
}
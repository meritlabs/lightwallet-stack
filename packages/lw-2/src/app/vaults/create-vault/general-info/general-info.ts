import * as Promise from 'bluebird';
import * as _ from "lodash";

import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { VaultsService } from 'merit/vaults/vaults.service';

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-general',
  templateUrl: 'general-info.html',
})
export class CreateVaultGeneralInfoView {

  public formData = { vaultName: '', whitelist: [] };
  public isNextAvailable = false;
  public whitelistCandidates = [];

  constructor(
    private navCtrl:NavController,
    private createVaultService: CreateVaultService, 
    private profileService: ProfileService,
    private walletService: WalletService,
    private vaultsService: VaultsService,
  ){}

  checkNextAvailable() {
    this.isNextAvailable = this.formData.vaultName.length > 0;
  }

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.vaultName = data.vaultName;
    this.formData.whitelist = data.whitelist;

    // fetch users wallets
    this.getAllWallets().then((wallets) => {
      const walletDTOs = _.map(wallets, (w) => {
        const name = w.name || w._id;
        return { 'id': w.id, 'name': name, 'pubKey': w.credentials.xPubKey };
      });
      this.whitelistCandidates = this.whitelistCandidates.concat(walletDTOs);
    });

    // fetch users vaults
    this.getAllWVaults().then((vaults) => {
      const vaultDTOs = _.map(vaults, (v) => {
        const name = v.name || v._id;
        const key = v.spendPubKey ? v.spendPubKey.xpubkey : ''; // Prevent errors
        return { 'id': v.id, 'name': name, 'pubKey': key }; // it does not seem to work. need other key here.
      });
      this.whitelistCandidates = this.whitelistCandidates.concat(vaultDTOs);
    });
  }

  toDeposit() {
    this.createVaultService.updateData(this.formData);
    this.navCtrl.push('CreateVaultDepositView');
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
    return this.profileService.getWallets().then((ws: any[]) => {
      if (_.isEmpty(ws)) {
        Promise.reject(new Error('getAllWVaults failed')); //ToDo: add proper error handling;
      }
      return _.head(ws);
    }).then((walletClient) => {
      return this.vaultsService.getVaults(walletClient);
    });
  }
}

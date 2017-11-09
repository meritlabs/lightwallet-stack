import * as _ from "lodash";

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigService } from "merit/shared/config.service";
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";

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
    private navParams: NavParams, 
    private createVaultService: CreateVaultService, 
    private profileService: ProfileService,
    private walletService: WalletService,
  ){}

  checkNextAvailable() {
    this.isNextAvailable = this.formData.vaultName.length > 0;
  }

  async ionViewDidLoad() {
    Promise.all([
      (() => {
        let data = this.createVaultService.getData();
        this.formData.vaultName = data.vaultName;
        this.formData.whitelist = data.whitelist;
      })(),
      (() => {
        this.updateAllWallets().then((wallets) => {
          this.whitelistCandidates.concat(wallets);
        });
      })(),
      (() => {
        this.updateAllWVaults().then((vaults) => {
          this.whitelistCandidates.concat(vaults);
        });
      })(),
    ]);
    
  }

  toDeposit() {
    this.createVaultService.updateData(this.formData);
    this.navCtrl.push('CreateVaultDepositView');
  }

  private async updateAllWallets() {
    let wallets = await this.profileService.getWallets();
    console.log(wallets);
    return await Promise.all(_.map(wallets, async (wallet:any) => {
      wallet.status = await this.walletService.getStatus(wallet);
      return wallet; 
    }));
  }

  private async updateAllWVaults() {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
}
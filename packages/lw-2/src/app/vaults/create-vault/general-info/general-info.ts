import * as Promise from 'bluebird';
import * as _ from "lodash";

import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-general',
  templateUrl: 'general-info.html',
})
export class CreateVaultGeneralInfoView {

  public formData = { vaultName: '', whitelist: [] };
  public isNextAvailable = false;
  public whitelistCandidates = [];
  public bitcore = null;

  constructor(
    private navCtrl:NavController,
    private createVaultService: CreateVaultService, 
    private profileService: ProfileService,
    private walletService: WalletService,
    private vaultsService: VaultsService,
    private bwc: BwcService,
    private logger: Logger,
    private toastCtrl:MeritToastController
  ){
    this.bitcore = this.bwc.getBitcore();
    this.logger.info('bitcore', this.bitcore);
  }

  checkNextAvailable() {
    this.isNextAvailable = this.formData.vaultName.length > 0 && this.formData.whitelist.length > 0; 
  }

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.vaultName = data.vaultName;
    this.formData.whitelist = data.whitelist;

    // fetch users wallets
    this.getAllWallets().then((wallets) => {
      const walletDTOs = _.map(wallets, (w: any) => {
        const name = w.name || w._id;
        return { 'id': w.id, 'name': name, 'address': w.credentials.xPubKey, 'type': 'wallet' };
      });
      this.logger.info('walletDTOs', walletDTOs);
      this.whitelistCandidates = this.whitelistCandidates.concat(walletDTOs);
    }).catch((err) => {
      this.toastCtrl.create({
        message: 'Failed to update wallets info',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });

    // fetch users vaults
    this.getAllVaults().then((vaults) => {
      const vaultDTOs = _.map(vaults, (v: any) => {
        const name = v.name || v._id;
        const key = new this.bitcore.Address(v.address).toString();
        this.logger.info(key);
        return { 'id': v._id, 'name': name, 'address': key, 'type': 'vault' };
      });
      this.logger.info('walletDTOs', vaultDTOs);
      this.whitelistCandidates = this.whitelistCandidates.concat(vaultDTOs);
    }).catch((err) => {
      this.toastCtrl.create({
        message: 'Failed to update vaults info',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });
  }

  toDeposit() {
    this.createVaultService.updateData(this.formData);
    this.navCtrl.push('CreateVaultDepositView');
  }

  private getAllWallets(): Promise<Array<any>> {

    return this.profileService.getWallets().map((wallet: any) => {
      return this.walletService.getStatus(wallet).then((status) => {
        wallet.status = status;
        return wallet;
      });
    });

  }

  private getAllVaults(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      if(!walletClient) {
        return null;
      }
      return this.vaultsService.getVaults(walletClient);
    });
  }
}

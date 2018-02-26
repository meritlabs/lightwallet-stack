import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { CreateVaultService } from '@merit/mobile/app/vaults/create-vault/create-vault.service';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { ProfileService } from '@merit/common/providers/profile';
import { WalletService } from '@merit/common/providers/wallet';
import { MWCService } from '@merit/common/providers/mwc';
import { LoggerService } from '@merit/common/providers/logger';
import { MeritToastController, ToastConfig } from '@merit/common/providers/toast.controller';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-general',
  templateUrl: 'general-info.html',
})
export class CreateVaultGeneralInfoView {

  formData = { vaultName: '', whitelist: [] };
  whitelistCandidates = [];
  bitcore = this.bwc.getBitcore();
  whitelistedWallets: any = {};

  constructor(private navCtrl: NavController,
              private createVaultService: CreateVaultService,
              private profileService: ProfileService,
              private walletService: WalletService,
              private vaultsService: VaultsService,
              private bwc: MWCService,
              private logger: LoggerService,
              private toastCtrl: MeritToastController,
              public navParams: NavParams,) {}

  get isNextAvailable(): boolean {
    return this.formData.vaultName.length > 0 && this.formData.whitelist.length > 0;
  }

  async ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.vaultName = data.vaultName;
    this.formData.whitelist = data.whitelist;

    // fetch users wallets
    try {
      const wallets = await this.getAllWallets();
      const walletDTOs = _.map(wallets, (w: any) => {
        const name = w.name || w._id;
        return { id: w.id, name: name, address: w.credentials.xPubKey, type: 'wallet', walletClientId: w.id };
      });
      this.logger.info('walletDTOs', walletDTOs);
      this.whitelistCandidates = this.whitelistCandidates.concat(walletDTOs);
    } catch (err) {
      this.toastCtrl.create({
        message: 'Failed to update wallets info',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    // fetch users vaults
    // ToDo: uncomment when vaults support vault addresses in whitelists
    // this.getAllVaults().then((vaults) => {
    //   const vaultDTOs = _.map(vaults, (v: any) => {
    //     const name = v.name || v._id;
    //     const key = new this.bitcore.Address(v.address).toString();
    //     this.logger.info(key);
    //     return { id: v._id, name: name, address: key, type: 'vault' };
    //   });
    //   this.logger.info('walletDTOs', vaultDTOs);
    //   this.whitelistCandidates = this.whitelistCandidates.concat(vaultDTOs);
    // }).catch((err) => {
    //   this.toastCtrl.create({
    //     message: 'Failed to update vaults info',
    //     cssClass: ToastConfig.CLASS_ERROR
    //   }).present();
    // });
  }

  toDeposit() {
    this.createVaultService.updateData(this.formData);
    this.navCtrl.push('CreateVaultDepositView', { refreshVaultList: this.navParams.get('refreshVaultList') });
  }

  setWhitelistedWallets(id: string) {
    const whitelistedWalletIndex = _.findIndex(this.formData.whitelist, { id });
    const candidateWallet = _.find(this.whitelistCandidates, { id });

    if (whitelistedWalletIndex === -1) {
      this.formData.whitelist.push(candidateWallet);
    } else {
      this.formData.whitelist.splice(whitelistedWalletIndex, 1);
    }
  }

  private async getAllWallets(): Promise<Array<any>> {
    const wallets = await this.profileService.getWallets();
    return Promise.all(wallets.map(async (wallet: any) => {
      wallet.status = await this.walletService.getStatus(wallet);
      return wallet;
    }));
  }

  private getAllVaults(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      if (!walletClient) {
        return null;
      }
      return this.vaultsService.getVaults(walletClient);
    });
  }
}

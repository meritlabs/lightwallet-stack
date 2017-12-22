import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from "merit/core/popup.service";
import * as Promise from 'bluebird';
import { WalletService } from 'merit/wallets/wallet.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';
import { Credentials } from 'src/lib/merit-wallet-client/lib/credentials';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { MeritToastController } from "merit/core/toast.controller";
import { ToastConfig } from "merit/core/toast.config";
import { Logger } from "merit/core/logger";


@IonicPage({
  segment: 'vault/:vaultId/renew/confirmation',
  defaultHistory: ['VaultRenewView']
})
@Component({ 
  selector: 'view-renew-confirmation',
  templateUrl: 'confirmation.html',
})
export class VaultRenewConfirmationView {

  private updatedVault: any;
  private vault: any;
  private bitcore: any;
  private formData = { masterKeyMnemonic: '' };
  private walletClient: MeritWalletClient = null;

  constructor(
    private navCtrl:NavController,
    public navParams: NavParams,
    private bwc: BwcService,  
    private toastCtrl:MeritToastController,
    private renewVaultService: RenewVaultService,
    private popupService: PopupService,
    private logger: Logger,
  ){
    this.updatedVault = this.navParams.get('updatedVault');
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
    this.walletClient = this.navParams.get('walletClient');

    console.log(this.navParams.get('refreshCb'));
  }

  ionViewDidLoad() {
    console.log('confirmation view', this.updatedVault, this.vault);
  }

  private sanatizeMnemonic(rawmnemonic: string): string{
    let trimmed = rawmnemonic.trim();
    return trimmed.toLowerCase();
  }

  private renew() {
    // create master key from mnemonic
    const network = this.vault.address.network;

    //validate mnemonic
    let masterKeyMnemonic;
    try {
      const sanatizedMasterKeyMnemonic = this.sanatizeMnemonic(this.formData.masterKeyMnemonic);
      masterKeyMnemonic = this.walletClient.getNewMnemonic(sanatizedMasterKeyMnemonic);
    } catch(ex) {
      return this.toastCtrl.create({
        message: 'The master key must only contain words seperated by spaces.',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const xMasterKey = masterKeyMnemonic.toHDPrivateKey('', network);
    console.log('xMasterKey', xMasterKey);
    console.log('MasterPub', xMasterKey.publicKey.toString());
    console.log('OrigPubKey', new this.bitcore.PublicKey(this.updatedVault.masterPubKey, network).toString());

    return this.renewVaultService.renewVault(this.updatedVault, xMasterKey).then(() => {
      return this.navCtrl.goToRoot({}).then(() => {
        return this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
      });
    }).then(() => {
      const refreshCb = this.navParams.get('refreshCb');
      refreshCb();
    }).catch((err) => {
      this.logger.error('Error renewing vault: ', err);
      this.popupService.ionicAlert('Cannot renew the vault.');
    });
  }
}

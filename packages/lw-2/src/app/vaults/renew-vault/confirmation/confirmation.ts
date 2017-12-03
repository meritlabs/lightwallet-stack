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
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';
import { Credentials } from 'src/lib/merit-wallet-client/lib/credentials';
import { IMeritClient } from 'src/lib/merit-wallet-client/lib';

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
    private formData = { masterKey: '' };
    private walletClient: IMeritWalletClient = null;

    constructor(
        private navCtrl:NavController,
        public navParams: NavParams,
        private bwc: BwcService,  
        private renewVaultService: RenewVaultService,
    ){
      this.updatedVault = this.navParams.get('updatedVault');
      this.vault = this.navParams.get('vault');
      this.bitcore = this.bwc.getBitcore();
      this.walletClient = this.navParams.get('walletClient');
    }

    ionViewDidLoad() {
        console.log('confirmation view', this.updatedVault, this.vault);
    }

    private renew() {
        // create master key from mnemonic
        const network = this.vault.address.network;
        const masterKeyMnemonic = this.walletClient.getNewMnemonic(this.formData.masterKey);
        const xMasterKey = masterKeyMnemonic.toHDPrivateKey('', network);
        console.log('xMasterKey', xMasterKey);
        console.log('MasterPub', xMasterKey.publicKey.toString());
        console.log('OrigPubKey', new this.bitcore.PublicKey(this.updatedVault.masterPubKey, network).toString());
       
        return this.renewVaultService.renewVault(this.updatedVault, xMasterKey).then(() => {
            this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
            return;
        });
    }
}

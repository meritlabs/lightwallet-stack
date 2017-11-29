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

@IonicPage({
  segment: 'vault/:vaultId/renew/confirmation',
  defaultHistory: ['VaultRenewView']
})
@Component({ 
  selector: 'view-renew-confirmation',
  templateUrl: 'confirmation.html',
})
export class VaultRenewConfirmationView {

    private newVault: any;
    private vault: any;
    private bitcore: any;
    private formData = { masterKey: '' };

    constructor(
        private navCtrl:NavController,
        public navParams: NavParams,
        private bwc: BwcService,  
        private renewVaultService: RenewVaultService,
    ){
      this.newVault = this.navParams.get('newVault');
      this.vault = this.navParams.get('vault');
      this.bitcore = this.bwc.getBitcore();
    }

    ionViewDidLoad() {
        console.log('confirmation view', this.newVault, this.vault);
    }

    private renew() {
        // create master key from mnemonic
        return this.renewVaultService.renewVault(this.newVault, this.formData.masterKey).then(() => {
            this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });
            return;
        });
    }
}
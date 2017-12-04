import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from "merit/core/popup.service";
import * as Promise from 'bluebird';
import { WalletService } from 'merit/wallets/wallet.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { Credentials } from 'src/lib/merit-wallet-client/lib/credentials';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { SpendVaultService } from 'merit/vaults/spend/vault-spend.service';

@IonicPage({
  segment: 'vault/:vaultId/spend/confirmation',
  defaultHistory: ['VaultSpendView']
})
@Component({ 
  selector: 'view-spend-confirmation',
  templateUrl: 'confirmation.html',
})
export class VaultSpendConfirmationView {

    private updatedVault: any;
    private vault: any;
    private amount: number;
    private address: any;
    private bitcore: any;
    private formData = { masterKey: '' };
    private walletClient: MeritWalletClient = null;

    constructor(
        private navCtrl:NavController,
        public navParams: NavParams,
        private bwc: BwcService,  
        private spendVaultService: SpendVaultService,
    ){
      this.updatedVault = this.navParams.get('updatedVault');
      this.vault = this.navParams.get('vault');
      this.amount = this.navParams.get('amount');
      const recepient = this.navParams.get('recipient');
      this.address = recepient.pubKey;
      this.bitcore = this.bwc.getBitcore();
      this.walletClient = this.navParams.get('wallet');
    }

    ionViewDidLoad() {
        console.log('confirmation view', this.updatedVault, this.vault);
    }

    private spend() {
        // create master key from mnemonic
        const network = this.vault.address.network;
        const masterKeyMnemonic = this.walletClient.getNewMnemonic(this.formData.masterKey);
        const xMasterKey = masterKeyMnemonic.toHDPrivateKey('', network);
        console.log('xMasterKey', xMasterKey);
        console.log('MasterPub', xMasterKey.publicKey.toString());
        console.log('OrigPubKey', new this.bitcore.PublicKey(this.vault.masterPubKey, network).toString());

        return this.spendVaultService.spendVault(this.vault, xMasterKey, this.amount, this.address).then(() => {
            this.navCtrl.push('VaultDetailsView', { vaultId: this.vault._id, vault: this.vault });    
        });
    }
}

import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { IMeritWalletClient} from './../../../lib/merit-wallet-client';
import { ProfileService } from 'merit/core/profile.service';
import * as _ from 'lodash';
import { VaultsService } from 'merit/vaults/vaults.service';


@Injectable()
export class RenewVaultService {

    private bitcore: any;
    private walletClient: IMeritWalletClient = null;
    private vault: any;

    constructor(
        private bwcService: BwcService,
        private walletService: WalletService,
        private logger: Logger,
        private profileService: ProfileService,
        private vaultsService: VaultsService,
    ){
        this.bitcore = bwcService.getBitcore();
    }

    renewVault(vault: any, masterKey: any): Promise<any> {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
          if (!this.walletClient) {
              this.walletClient = walletClient;
          }
          return this.vaultsService.getVaultCoins(walletClient, vault);
        }).then((coins) => {
      
            let address = this.bitcore.Address.fromObject(vault.address);
            let network = this.walletClient.credentials.network;

            let tx = this.walletClient.buildRenewVaultTx(coins, vault, masterKey, {network: network});
    
            console.log("RENEW TX");
            console.log('Serialized: ', tx.serialize());

            return { rawTx: tx.serialize(), network: network };
        }).then((tx) => {
            return this.walletClient.broadcastRawTx(tx);
        }).catch((err) => {
            console.log('Error while renewing vault:', err);
            throw err;
        });;
    }

}

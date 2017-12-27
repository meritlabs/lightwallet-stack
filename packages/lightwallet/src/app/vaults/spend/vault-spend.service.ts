import { Injectable } from '@angular/core';

import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import * as _ from 'lodash';
import { VaultsService } from 'merit/vaults/vaults.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';


@Injectable()
export class SpendVaultService {

    private bitcore: any;
    private walletClient: MeritWalletClient = null;
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

    spendVault(vault: any, spendKey: any, amount: number, address: any): Promise<any> {
        return this.profileService.getHeadWalletClient().then((walletClient) => {
          if (!this.walletClient) {
              this.walletClient = walletClient;
          }
          return this.vaultsService.getVaultCoins(walletClient, vault);
        }).then((coins) => {
            const tx = this.walletClient.buildSpendVaultTx(vault, coins, spendKey, amount, address, {});

            console.log("SPEND TX");
            console.log('Plain: ', tx);
            console.log('Serialized: ', tx.serialize());

            return { rawTx: tx.serialize(), network: vault.address.network };
        }).then((tx) => {
            return this.walletClient.broadcastRawTx(tx);
        }).catch((err) => {
            console.log('Error while spending vault:', err);
            throw err;
        });;
    }

}

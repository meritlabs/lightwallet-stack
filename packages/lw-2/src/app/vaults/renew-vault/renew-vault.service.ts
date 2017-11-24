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
        console.log('vault to renew', vault);
        console.log('master key', masterKey);
        return this.profileService.getHeadWalletClient().then((walletClient) => {
          if (!this.walletClient) {
              this.walletClient = walletClient;
          }
          return this.vaultsService.getVaultCoins(walletClient, vault);
        }).then((coins) => {
      
            let address = this.bitcore.Address.fromObject(vault.address);
    
            console.log(address.toString());
            console.log(vault);
            console.log(coins);
    
            let network = this.walletClient.credentials.network;
            let dummyKey = this.bitcore.PrivateKey.fromRandom(network);
    
            let tx = this.walletClient.buildRenewVaultTx(coins, vault, masterKey, {network: network});
    
            console.log("RENEW TX");
            console.log(tx);
            return tx;
        }).then((txp) => {
            return this.walletService.prepare(this.walletClient).then((password: string) => {
              return { password: password, txp: txp};
            });
        }).then((args: any) => {
            return this.walletService.publishTx(this.walletClient, args.txp).then((pubTxp)=> {
              return { password: args.password, txp: pubTxp};
            });
        }).then((args: any) => {
            return this.walletService.signTx(this.walletClient, args.txp, args.password);
        }).then((txp) => {
            return this.walletClient.broadcastRawTx(txp);
        }).catch((err) => {
            console.log('Error while renewing vault:', err);
            throw err;
        });;
    }

}
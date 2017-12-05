import { Injectable } from '@angular/core';
import * as Promise from 'bluebird';
import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import * as _ from 'lodash';
import { VaultsService } from 'merit/vaults/vaults.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';


@Injectable()
export class DepositService {

    private bitcore: any;
    private walletClient: MeritWalletClient = null;
    private vault: any;

    constructor(
        private bwcService: BwcService,
        private walletService: WalletService,
        private logger: Logger,
        private profileService: ProfileService,
    ){
        this.bitcore = bwcService.getBitcore();
    }

    depositToVault(vault: any, wallet: any, amount: number): Promise<any> {
        console.log('VAULT', vault);
        console.log('WALLET', wallet);
        console.log('amount', amount);

        let vaultTx = this.prepareVault(wallet, vault, amount)
        console.log('prepared', vaultTx);
        
        return this.getTxp(vaultTx, wallet, false).then((txp) => {
            return this.walletService.prepare(wallet).then((password: string) => {
              return { password: password, txp: txp};
            });
        }).then((args: any) => {
            return this.walletService.publishTx(wallet, args.txp).then((pubTxp)=> {
                return { password: args.password, txp: pubTxp};
            });
        }).then((args: any) => {
            return this.walletService.signTx(wallet, args.txp, args.password);
        }).then((signedTxp: any) => {
            return vault;
        }).then((vault) => {
            vault.name = vault.vaultName;
            return wallet.createVault(vault);
        }).then((resp) => {
            return this.profileService.addVault({
                id: vault.address,
                copayerId: wallet.credentials.copayerId,
                name: vault.vaultName,
            });
        }).catch((err) => {
            this.logger.info('Error while creating vault:', err);
            return Promise.reject(err);
        });
    }

    private prepareVault(wallet: any, vault: any, amount: number) {
        //currently only supports type 0 which is a whitelisted vault.
        let whitelist = _.map(vault.whitelist, (w: string) => {
            return this.bitcore.Address.fromString(w).toBuffer();
        });

        const network = vault.address.network;
        console.log(network);
        const masterKey = new this.bitcore.PublicKey(vault.masterPubKey, network);
        const spendPubKey = new this.bitcore.PublicKey(vault.spendPubKey, network);

        return wallet.prepareVault(0, {
          amount: amount,
          whitelist: whitelist,
          masterPubKey: masterKey,
          spendPubKey: spendPubKey,
        });
      }

    private getTxp(vault, wallet, dryRun: boolean): Promise<any> {
        return this.findFeeLevel(vault.amount).then((feeLevel) => {
            if (vault.amount > Number.MAX_SAFE_INTEGER) {
                return Promise.reject("The amount is too big.  Because, Javascript.");
            }

            let txp = {
            outputs: [{
                'toAddress': vault.address.toString(),
                'script': vault.scriptPubKey.toBuffer().toString('hex'),
                'amount': vault.amount}],
            addressType: 'PP2SH',
            inputs: null, //Let merit wallet service figure out the inputs based
                            //on the selected wallet.
            feeLevel: feeLevel,
            excludeUnconfirmedUtxos: true,
            dryRun: dryRun,
            };
            return this.walletService.createTx(wallet, txp);
        });
    }

    private findFeeLevel(amount: number) : Promise<any> {
        return Promise.resolve(null);
    }

}

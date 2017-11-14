import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';
import { MeritWalletClient, IMeritWalletClient} from './../../../../../merit-wallet-client';
import * as _ from 'lodash';

@Injectable()
export class CreateVaultService {

    private bitcore: any;
    private walletClient: IMeritWalletClient;
    private model = { vaultName: '', whitelist: [], amountToDeposit: 0.0, amountAvailable: 10000, masterKey: null };

    constructor(
        private bwcService: BwcService,
        private walletService: WalletService,
        private logger: Logger
    ) {
        this.bitcore = this.bwcService.getBitcore();
        this.walletClient = this.bwcService.getClient(null, {});
    }

    updateData(fields: any): void {
        this.model = _.assign({}, this.model, fields);
    }

    getData(): any {
        return this.model;
    }

    private resetModel() {
        this.model = { vaultName: '', whitelist: [], amountToDeposit: 0.0, amountAvailable: 10000, masterKey: null };
    }

    private vaultFromModel(spendPubKey: any) {
        //currently only supports type 0 which is a whitelisted vault.
        return this.walletClient.prepareVault(0, {
            whitelist: this.model.whitelist,
            masterPubKey: this.model.masterKey.toPublicKey(),
            spendPubKey: spendPubKey
        });
    }

    createVault(): Promise<any> {

        if(_.isEmpty(this.model.whitelist)) {

            return this.walletService.getAddress(this.walletClient, false).then((addresses) => {
                let spendPubKey = this.bitcore.PublicKey.fromString(addresses.publicKeys[0]);

                let vault = this.vaultFromModel(spendPubKey);

                this.logger.info("VAULT");
                this.logger.info(vault);

                this.resetModel();
                return vault;
            });

        } else {

            let wallet = this.model.whitelist[0];
            let spendPubKey = wallet.pubKey;

            return new Promise((resolve, reject) => {

                let vault = this.vaultFromModel(spendPubKey);

                this.logger.info("VAULT");
                this.logger.info(vault);

                this.resetModel();
                resolve(vault);
            });
        }
    }
       
}

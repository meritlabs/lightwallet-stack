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
        private vaultsService: VaultsService,
    ){
        this.bitcore = bwcService.getBitcore();
    }

    depositToVault(): Promise<any> {
        return Promise.resolve();
    }

}

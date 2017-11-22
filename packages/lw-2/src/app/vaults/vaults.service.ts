import { Injectable } from '@angular/core';
import * as Promise from 'bluebird'; 

import { BwcService } from 'merit/core/bwc.service';

import { IMeritWalletClient } from './../../lib/merit-wallet-client';


@Injectable()
export class VaultsService {

    constructor(
        private bwcService: BwcService,
    ) {
        console.log('hello VaultsService');
    }

    getVaults(walletClient: IMeritWalletClient): Promise<Array<any>> {
        console.log('getting vaults');
        return walletClient.getVaults();
    }

}
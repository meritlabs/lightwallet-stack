import { Injectable } from '@angular/core';
import * as Promise from 'bluebird'; 

import { BwcService } from 'merit/core/bwc.service';

import { MeritWalletClient } from './../../lib/merit-wallet-client';
import { Logger } from 'merit/core/logger';


@Injectable()
export class VaultsService {

    constructor(
        private bwcService: BwcService,
        private logger: Logger
    ) {
        this.logger.info('hello VaultsService');
    }

    getVaults(walletClient: MeritWalletClient): Promise<Array<any>> {
        this.logger.info('getting vaults');
        return walletClient.getVaults();
    }

}
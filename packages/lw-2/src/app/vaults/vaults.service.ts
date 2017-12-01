import { Injectable } from '@angular/core';
import * as Promise from 'bluebird'; 

import { BwcService } from 'merit/core/bwc.service';

import { MeritWalletClient } from './../../lib/merit-wallet-client';
import { Logger } from 'merit/core/logger';


@Injectable()
export class VaultsService {
    private bitcore: any;
  
    constructor(
        private bwcService: BwcService,
        private logger: Logger
    ) {
        this.logger.info('hello VaultsService');
        this.bitcore = this.bwcService.getBitcore();        
    }

    getVaults(walletClient: MeritWalletClient): Promise<Array<any>> {
        this.logger.info('getting vaults');
        return walletClient.getVaults();
    }

    getVaultCoins(walletClient: MeritWalletClient, vault: any): Promise<Array<any>> {
      console.log('getting vaults');
      const address = this.bitcore.Address.fromObject(vault.address);
      return walletClient.getVaultCoins(address.toString());
    }

}
  
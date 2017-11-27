import { Injectable } from '@angular/core';
import * as Promise from 'bluebird'; 

import { BwcService } from 'merit/core/bwc.service';

import { IMeritWalletClient } from './../../lib/merit-wallet-client';


@Injectable()
export class VaultsService {

  private bitcore: any;

  constructor(private bwcService: BwcService) {
    console.log('hello VaultsService');
    this.bitcore = this.bwcService.getBitcore();
  }

  getVaults(walletClient: IMeritWalletClient): Promise<Array<any>> {
    console.log('getting vaults');
    return walletClient.getVaults();
  }

  getVaultCoins(walletClient: IMeritWalletClient, vault: any): Promise<Array<any>> {
    console.log('getting vaults');
    const address = this.bitcore.Address.fromObject(vault.address);
    return walletClient.getVaultCoins(address.toString());
  }

  getVaultTxHistory(walletClient: IMeritWalletClient, vault: any): Promise<Array<any>> {
    return walletClient.getVaultTxHistory(vault._id, vault.address.network);
  }

}

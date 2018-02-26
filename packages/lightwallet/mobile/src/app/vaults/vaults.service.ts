import { Injectable } from '@angular/core';
import { LoggerService } from '@merit/common/providers/logger.service';
import { MWCService } from '@merit/common/providers/mwc.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class VaultsService {
  private bitcore: any;

  constructor(private bwcService: MWCService,
              private logger: LoggerService) {
    this.logger.info('hello VaultsService');
    this.bitcore = this.bwcService.getBitcore();
  }

  getVaults(walletClient: MeritWalletClient): Promise<Array<any>> {
    this.logger.info('getting vaults');
    return walletClient.getVaults();
  }

  getVaultCoins(walletClient: MeritWalletClient, vault: any): Promise<Array<any>> {
    const address = this.bitcore.Address.fromObject(vault.address);
    return walletClient.getVaultCoins(address.toString());
  }

  getVaultTxHistory(walletClient: MeritWalletClient, vault: any): Promise<Array<any>> {
    return walletClient.getVaultTxHistory(vault._id, vault.address.network);
  }

}

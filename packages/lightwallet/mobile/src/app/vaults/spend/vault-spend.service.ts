import { Injectable } from '@angular/core';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { MWCService } from '@merit/common/providers/mwc.service';
import { WalletService } from '@merit/common/providers/wallet.service';
import { LoggerService } from '@merit/common/providers/logger.service';
import { ProfileService } from '@merit/common/providers/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@Injectable()
export class SpendVaultService {

  private bitcore: any;
  private walletClient: MeritWalletClient = null;
  private vault: any;

  constructor(private bwcService: MWCService,
              private walletService: WalletService,
              private logger: LoggerService,
              private profileService: ProfileService,
              private vaultsService: VaultsService,) {
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
      return { rawTx: tx.serialize(), network: vault.address.network };
    }).then((tx) => {
      return this.walletClient.broadcastRawTx(tx);
    }).catch((err) => {
      console.log('Error while spending vault:', err);
      throw err;
    });
    ;
  }

}

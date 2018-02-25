import { Injectable } from '@angular/core';
import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { ProfileService } from '@merit/mobile/app/core/profile.service';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { WalletService } from '@merit/mobile/app/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@Injectable()
export class SpendVaultService {

  private bitcore: any;
  private walletClient: MeritWalletClient = null;
  private vault: any;

  constructor(private bwcService: BwcService,
              private walletService: WalletService,
              private logger: Logger,
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

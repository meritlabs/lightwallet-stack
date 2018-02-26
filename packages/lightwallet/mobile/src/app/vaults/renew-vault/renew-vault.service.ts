import { Injectable } from '@angular/core';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MWCService } from '@merit/common/providers/mwc.service';
import { ProfileService } from '@merit/common/providers/profile.service';

@Injectable()
export class RenewVaultService {

  private bitcore: any;
  private walletClient: MeritWalletClient;

  constructor(private bwcService: MWCService,
              private profileService: ProfileService,
              private vaultsService: VaultsService,) {
    this.bitcore = bwcService.getBitcore();
  }

  renewVault(vault: any, masterKey: any): Promise<any> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      if (!this.walletClient) {
        this.walletClient = walletClient;
      }
      return this.vaultsService.getVaultCoins(walletClient, vault);
    }).then((coins) => {

      let network = this.walletClient.credentials.network;

      let tx = this.walletClient.buildRenewVaultTx(coins, vault, masterKey, { network: network });

      console.log('RENEW TX');
      console.log('tx: ', tx);
      console.log('Serialized: ', tx.serialize());
      vault.coins = [{ raw: tx.serialize(), network: network }];

      return this.walletClient.renewVault(vault);
    }).catch((err) => {
      throw err;
    });
  }

}

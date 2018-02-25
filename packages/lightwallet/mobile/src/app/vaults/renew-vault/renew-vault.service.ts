import { Injectable } from '@angular/core';

import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { ProfileService } from '@merit/mobile/app/core/profile.service';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { WalletService } from '@merit/mobile/app/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';

@Injectable()
export class RenewVaultService {

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

  renewVault(vault: any, masterKey: any): Promise<any> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      if (!this.walletClient) {
        this.walletClient = walletClient;
      }
      return this.vaultsService.getVaultCoins(walletClient, vault);
    }).then((coins) => {

      let address = this.bitcore.Address.fromObject(vault.address);
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
    ;
  }

}

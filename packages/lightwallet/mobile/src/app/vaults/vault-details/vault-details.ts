import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/providers/profile';
import { WalletService } from '@merit/common/providers/wallet';
import { VaultsService } from '@merit/mobile/app/vaults/vaults.service';
import { MWCService } from '@merit/common/providers/mwc';
import { TxFormatService } from '@merit/common/providers/tx-format';
import { RateService } from '@merit/common/providers/rate';
import { FiatAmount } from '@merit/common/models/fiat-amount';

@IonicPage({
  segment: 'vault/:vaultId',
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'vault-details-view',
  templateUrl: 'vault-details.html',
})
export class VaultDetailsView {

  public vault: any;
  public whitelist: Array<any> = [];
  public coins: Array<any> = [];
  public transactions: Array<any> = [];
  private bitcore: any = null;
  private walletClient: MeritWalletClient;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private profileService: ProfileService,
              private walletService: WalletService,
              private vaultsService: VaultsService,
              private bwc: MWCService,
              private txFormatService: TxFormatService,
              private rateService: RateService) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
    this.whitelist = this.vault.whitelist;
    console.log('Inside the vault-details view.');
    console.log('Vault to display:', this.vault);
  }

  ionViewDidLoad() {
    console.log('Vault-Detail View Did Load.');
    console.log(this.vault);

    Promise.all([
      this.getAllWallets().then((wallets) => {
        return _.map(wallets, (w) => {
          const name = w.name || w._id;
          const addr = this.bitcore.HDPublicKey.fromString(w.credentials.xPubKey).publicKey.toAddress().toString();
          return { id: w.id, name: name, address: addr, type: 'wallet', walletClientId: w.id, walletClient: w };
        });
      }),
      // fetch users vaults
      // ToDo: uncomment when vaults support vault addresses in whitelists
      // this.getAllVaults().then((vaults) => {
      //   return _.map(vaults, (v) => {
      //     const name = v.name || v._id;
      //     const addr = new this.bitcore.Address(v.address).toString();
      //     return { id: v._id, name: name, address: addr, type: 'vault' };
      //   });
      // }),
      // fetch coins
    ]).then((arr: Array<Array<any>>) => {
      const whitelistCandidates = _.flatten(arr);

      return Promise.all(this.vault.whitelist.map((wl) => {
        return Promise.all(whitelistCandidates.map((candidate) => {
          if (candidate.type === 'vault') {
            if (wl == candidate.address) return candidate;
          } else {
            return candidate.walletClient.getMainAddresses({}).then((addresses: Array<any>) => {
              const found = _.find(addresses, { address: wl });
              if (found) {
                candidate.walletClient = null;
                candidate.address = wl;
                return candidate;
              }
            });
          }
          return null;
        }));
      })).then((unfilteredWhitelist) => {
        const results = _.compact(_.flatten(unfilteredWhitelist));
        this.whitelist = results;
        return Promise.resolve();
      });
    }).then(() => {
      return this.getVaultTxHistory().then((txs) => {
        this.transactions = txs.filter(tx => !tx.isInvite).map(this.processTx.bind(this));
        this.vault.completeHistory = txs;
        this.formatAmounts();
        return Promise.resolve();
      });
    });
  }

  toResetVault() {
    this.navCtrl.push('VaultRenewView', { vaultId: this.vault._id, vault: this.vault });
  }

  goToTxDetails(tx: any) {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      this.navCtrl.push(
        'TxDetailsView',
        {
          wallet: walletClient,
          walletId: walletClient.credentials.walletId,
          vaultId: this.vault._id,
          vault: this.vault,
          tx
        }
      );
    });
  }

  spendToAddress(address): void {
    let wallet = null;
    this.profileService.getHeadWalletClient().then((w) => {
      wallet = w;
      return this.vaultsService.getVaultCoins(w, this.vault);
    }).then((coins) => {
      this.coins = coins;
      this.navCtrl.push('VaultSpendAmountView', {
        recipient: address,
        wallet: wallet,
        vault: this.vault,
        vaultId: this.vault.id,
        coins: coins
      });
    });
  }

  private getAllWallets(): Promise<Array<any>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      return Promise.all(_.map(ws, async (wallet: any) => {
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet;
      }));
    })
    return wallets;
  }

  private getAllVaults(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      this.walletClient = walletClient;
      return this.vaultsService.getVaults(walletClient);
    });
  }

  private getCoins(walletClient: MeritWalletClient): Promise<Array<any>> {
    return this.vaultsService.getVaultCoins(walletClient, this.vault);
  };

  private getVaultTxHistory(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      return this.vaultsService.getVaultTxHistory(walletClient, this.vault);
    });
  };

  private formatAmounts(): void {
    this.profileService.getHeadWalletClient().then((walletClient: MeritWalletClient) => {
      return this.getCoins(walletClient).then((coins) => {
        this.vault.amount = _.sumBy(coins, 'micros');
        this.vault.altAmount = this.rateService.fromMicrosToFiat(this.vault.amount, walletClient.cachedStatus.alternativeIsoCode);
        this.vault.altAmountStr = new FiatAmount(this.vault.altAmount);
        this.vault.amountStr = this.txFormatService.formatAmountStr(this.vault.amount);
      });
    });
  }

  private processTx(tx: any): any {
    const summ = _.reduce(tx.outputs, (acc: number, output: any) => {
      if (tx.addressTo !== output.address) {
        return acc;
      }

      return acc + output.amount;
    }, 0);

    tx.amountStr = this.txFormatService.formatAmountStr(summ);
    return tx;
  }
}

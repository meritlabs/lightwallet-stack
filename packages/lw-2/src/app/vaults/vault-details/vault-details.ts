import * as _ from "lodash";
import * as Promise from 'bluebird';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { Logger } from 'merit/core/logger';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { TxFormatService } from "merit/transact/tx-format.service";
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { RateService } from 'merit/transact/rate.service';


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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger:Logger,
    private profileService: ProfileService,
    private walletService: WalletService,
    private vaultsService: VaultsService,
    private bwc: BwcService,
    private txFormatService:TxFormatService,
    private rateService: RateService,
  ) {
    // We can assume that the wallet data has already been fetched and
    // passed in from the wallets (list) view.  This enables us to keep
    // things fast and smooth.  We can refresh as needed.
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
    this.whitelist = this.vault.whitelist;
    console.log("Inside the vault-details view.");
    console.log('Vault to display:', this.vault);
  }

  async ionViewDidLoad() {
    console.log("Vault-Detail View Did Load.");
    console.log(this.vault);

    await Promise.all([
      this.getAllWallets().then((wallets) => {
        return _.map(wallets, (w) => {
          const name = w.name || w._id;
          const key = this.bitcore.HDPublicKey.fromString(w.credentials.xPubKey).publicKey.toAddress().toString();
          return { 'id': w.id, 'name': name, 'pubKey': key, 'type': 'wallet', walletClient: w };
        });
      }),
      // fetch users vaults
      this.getAllVaults().then((vaults) => {
        return _.map(vaults, (v) => {
          const name = v.name || v._id;
          const key = new this.bitcore.Address(v.address).toString();
          return { 'id': v._id, 'name': name, 'pubKey': key, 'type': 'vault' };
        });
      }),
      // fetch coins
    ]).then((arr: Array<Array<any>>) => {
      const whitelistCandidates = _.flatten(arr);
      const results = [];
      _.each(this.vault.whitelist, (wl) => {
        let found = _.find(whitelistCandidates, (candidate) => {
          if (candidate.type === 'vault') {
            return candidate.pubKey === wl;
          } 

          const addr = this.bitcore.Address.fromString(wl);
          return candidate.walletClient.isMine(addr);
        });
        if (found) {
          results.push(found);
        }
      });
      this.whitelist = results;
    });

    await this.getVaultTxHistory().then((txs) => {
      console.log(txs);
      this.transactions = _.map(txs, this.processTx.bind(this));
      this.vault.completeHistory = txs;
    });

    await this.formatAmounts();
  }

  toResetVault() {
    this.navCtrl.push('VaultRenewView', { vaultId: this.vault._id, vault: this.vault });
  }

  goToTxDetails(tx: any) {
    this.navCtrl.push(
      'TxDetailsView',
      { wallet: this.walletClient, walletId: this.walletClient.credentials.walletId, vaultId: this.vault._id, vault: this.vault, txId: tx.txid }
    );
  }

  spendToAddress(address): void {
    let wallet = null;
    this.profileService.getHeadWalletClient().then((w) => {
      wallet = w;
      return this.vaultsService.getVaultCoins(w, this.vault);
    }).then((coins) => {
      this.coins = coins;
      this.navCtrl.push('VaultSpendAmountView', { recipient: address, wallet: wallet, vault: this.vault, coins: coins });
    });
  }

  private getAllWallets(): Promise<Array<any>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      return Promise.all(_.map(ws, async (wallet:any) => {
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet;
      }));
    })
    return wallets;
  }

  private getAllVaults(): Promise<Array<any>> {
    return this.profileService.getWallets().then((ws) => {
      if (_.isEmpty(ws)) {
        Promise.resolve(null); //ToDo: add proper error handling;
      }
      return _.head(ws);
    }).then((walletClient) => {
      this.walletClient = walletClient;
      return this.vaultsService.getVaults(walletClient);
    });
  }

  private getCoins(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      return this.vaultsService.getVaultCoins(walletClient, this.vault);
    });
  };

  private getVaultTxHistory(): Promise<Array<any>> {
    return this.profileService.getHeadWalletClient().then((walletClient) => {
      return this.vaultsService.getVaultTxHistory(walletClient, this.vault);
    });
  };

  private formatAmounts(): void {
    this.profileService.getHeadWalletClient().then((walletClient: MeritWalletClient) => {
      this.vault.altAmount = this.rateService.toFiat(this.vault.amount,walletClient.cachedStatus.alternativeIsoCode);
      this.vault.altAmountStr = new FiatAmount(this.vault.altAmount);
      this.vault.amountStr = this.txFormatService.formatAmountStr(this.vault.amount);
    });
  }

  private processTx(tx: any): any {
    const thisAddr = new this.bitcore.Address(this.vault.address).toString();
    const summ = _.reduce(tx.outputs, (acc: number, output: any) => {
      if (output.address != thisAddr) {
        return acc;
      }
      return acc + output.amount;
    }, 0);

    tx.amountStr = this.txFormatService.formatAmountStr(summ);
    return tx;
  }
}

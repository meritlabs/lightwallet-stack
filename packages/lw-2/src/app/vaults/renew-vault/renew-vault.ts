import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from "merit/core/popup.service";
import * as Promise from 'bluebird';
import { WalletService } from 'merit/wallets/wallet.service';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { RenewVaultService } from 'merit/vaults/renew-vault/renew-vault.service';

export interface IWhitelistEntry {
    id: string,
    name: string,
    address: string,
    type: string,
    walletClient?: any,
}

export interface IVaultRenewViewModel {
    vaultName: string, 
    masterKey: string,
    whitelist: Array<IWhitelistEntry>,
}

@IonicPage({
  segment: 'vault/:vaultId/renew',
  defaultHistory: ['VaultDetailsView']
})
@Component({
  selector: 'view-renew',
  templateUrl: 'renew-vault.html',
})
export class VaultRenewView {

  public vault: any = null;
  public formData: IVaultRenewViewModel = { vaultName: '', masterKey: '', whitelist: [] };
  public whitelistCandidates: Array<IWhitelistEntry> = [];
  public canConfirm: boolean;
  private bitcore: any = null;
  private walletClient: MeritWalletClient;

  constructor(
    private navCtrl:NavController,
    public navParams: NavParams,
    private popupService: PopupService,
    private bwc: BwcService,  
    private walletService: WalletService,
    private vaultsService: VaultsService,  
    private profileService: ProfileService,
  ){
    this.vault = this.navParams.get('vault');
    this.bitcore = this.bwc.getBitcore();
  }

  async ionViewDidLoad() {
    await this.updateWhitelist();
    this.formData.vaultName = this.vault.name;
    this.formData.masterKey = '';
    this.checkCanConfirm();
  }

  checkCanConfirm() {
    this.canConfirm = 
      this.formData.vaultName.length > 0 && 
      this.formData.whitelist.length > 0;
  }

  confirmRenew() {
    this.popupService.ionicConfirm(
        'Reset vault?', 
        'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?', 
        'Yes', 
        'No').then((result: boolean) => {
          if (result) this.toVault();
          return;
        });
  }

  toVault() {
    const newVault = _.cloneDeep(this.vault);
    Promise.map(this.formData.whitelist, (w: any) => {

      let address;
      if(w.type == 'wallet') {
        address = this.getAllWallets().then((wallets) => {
          let foundWallet = _.find(wallets, { id: w.walletClientId });
          return foundWallet.createAddress().then((resp) => {
              return this.bitcore.Address.fromString(resp.address);
          });
        });
      } else {
        address = Promise.resolve(this.bitcore.Address.fromString(w.address));
      }
      return address;
    }).then((whitelist) => {
      newVault.whitelist = _.map(whitelist, (a) => {return a.toBuffer()});
      newVault.masterKey = this.formData.masterKey;
      newVault.name = this.formData.vaultName;
      this.navCtrl.push('VaultRenewConfirmationView', { vaultId: this.vault._id, vault: this.vault, updatedVault: newVault, walletClient: this.walletClient });      
    });
  }

  regenerateMasterKey() {
    let network = this.walletClient.credentials.network || 'testnet';
    let masterKey = this.bitcore.PrivateKey.fromRandom(network);
    let masterKeyMnemonic = this.walletClient.getNewMnemonic(masterKey.toBuffer());

    this.formData.masterKey = masterKey;

    this.popupService.ionicAlert(
        'Master key',
        masterKeyMnemonic,
        'I copied the Master Key.'
    );
  }

  compareWhitelistEntries(e1: IWhitelistEntry, e2: IWhitelistEntry): boolean {
    return e1.type == e2.type && e1.id == e2.id;
  }

  private updateWhitelist(): Promise<any> {
    return Promise.all([
      // fetch users wallets
      this.getAllWallets().then((wallets) => {
        return _.map(wallets, (w) => {
          const name = w.name || w._id;
          const addr = this.bitcore.HDPublicKey.fromString(w.credentials.xPubKey).publicKey.toAddress().toString();
          return { 'id': w.id, 'name': name, 'address': addr, 'type': 'wallet', walletClient: w, walletClientId: w.id };
        });
      }), 
      // fetch users vaults
      this.getAllWVaults().then((vaults) => {
        return _.map(vaults, (v) => {
          const name = v.name || v._id;
          const addr = new this.bitcore.Address(v.address).toString();
          return { 'id': v._id, 'name': name, 'address': addr, 'type': 'vault' }; 
        });
      }),
    ]).then((arr: Array<Array<IWhitelistEntry>>) => {
      const whitelistCandidates = _.flatten(arr);
      const filtered = _.reject(whitelistCandidates, { id: this.vault._id });
      this.whitelistCandidates = filtered;
      
      return Promise.map(this.vault.whitelist, (wl: string) => {
        return Promise.map(whitelistCandidates, (candidate) => {
          if (candidate.type === 'vault') {
            if (wl == candidate.address) return candidate;
          } else { 
            return candidate.walletClient.getMainAddresses({}).then((addresses: Array<any>) => {
              const found = _.find(addresses, { address: wl });
              candidate.walletClient = null;
              if (found) {
                candidate.address = wl;
                return candidate;
              }
            });
          }
          return null;
        });
      }).then((unfilteredWhitelist) => {
        const results = _.compact(_.flatten(unfilteredWhitelist));
        this.formData.whitelist = results;
        return Promise.resolve();
      });
    });
  }

  private getAllWallets(): Promise<Array<any>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      this.walletClient = _.head(ws);
      return Promise.all(_.map(ws, async (wallet:any) => {
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet; 
      }));
    })
    return wallets;
  }

  private getAllWVaults(): Promise<Array<any>> {
    return this.profileService.getWallets().then((ws: any[]) => {
      if (_.isEmpty(ws)) {
        Promise.reject(new Error('getAllWVaults failed')); //ToDo: add proper error handling;
      }
      return _.head(ws);
    }).then((walletClient) => {
      this.walletClient = walletClient;
      return this.vaultsService.getVaults(walletClient);
    });
  }
}

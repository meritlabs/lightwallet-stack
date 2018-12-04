import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { VaultsService } from '@merit/common/services/vaults.service';
import { AddressService } from '@merit/common/services/address.service';
import { ModalController } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

@IonicPage()
@Component({
  selector: 'view-vault',
  templateUrl: 'vault.html',
})
export class VaultView {
  public vault: IVault;
  public vaultId: string;
  public wallets: Array<MeritWalletClient>;
  public transactions: Array<any>;
  public indexedWallets: { [rootAddress: string]: MeritWalletClient };

  public whitelist: Array<{ label: string; address: string; alias: string }>;

  constructor(
    private navParams: NavParams,
    private vaultsService: VaultsService,
    private addressService: AddressService,
    private modalCtrl: ModalController,
  ) {
    this.vault = this.navParams.get('vault');
    this.vaultId = this.navParams.get('vaultId');
    this.wallets = this.navParams.get('wallets');
    this.indexedWallets = this.wallets.reduce((result, w) => {
      result[w.rootAddress.toString()] = w;
      return result;
    }, {});
  }

  async ionViewWillEnter() {
    this.whitelist = await this.formatWhiteList(this.vault.whitelist);
    const transactions = await this.vaultsService.getTxHistory(this.vault);
    this.transactions = transactions.map((tx: any) => {
      if (tx.type == 'renewal') {
        tx.label = 'renewed';
      } else if (tx.type == 'stored') {
        tx.label = 'Stored';
      } else {
        tx.label = this.indexedWallets[tx.address] ? this.indexedWallets[tx.address].name : tx.alias || tx.address;
        tx.amount += tx.fee; //showing full spent amount when sending from vault
      }
      return tx;
    });
  }

  private async formatWhiteList(whitelist) {
    const formattedWhitelist = [];
    for (let address of whitelist) {
      const addressInfo = await this.addressService.getAddressInfo(address);
      if (addressInfo.isConfirmed) {
        const wallet = this.indexedWallets[addressInfo.address];
        const label = wallet && wallet.name ? wallet.name : addressInfo.alias || addressInfo.address;
        formattedWhitelist.push({ label, address: addressInfo.address, alias: addressInfo.alias });
      }
    }
    return formattedWhitelist;
  }

  viewTxDetails(tx) {
    return this.modalCtrl.create('TxDetailsView', { tx }, MERIT_MODAL_OPTS).present();
  }
}

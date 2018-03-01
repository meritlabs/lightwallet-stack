import { Component } from '@angular/core';
import { IonicPage,  NavParams } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { IDisplayWallet } from '@merit/common/models/display-wallet';
import { VaultsService }from '@merit/common/services/vaults.service';
import { AddressService } from "@merit/common/services/address.service";

@IonicPage()
@Component({
  selector: 'view-vault',
  templateUrl: 'vault.html',
})
export class VaultView {

  public vault: IVault;
  public vaultId: string;
  public wallets: Array<IDisplayWallet>;
  public transactions: Array<any>;

  public whitelist: Array<{label: string, address: string, alias: string}>;

  constructor(
    private navParams: NavParams,
    private vaultsService: VaultsService,
    private addressService: AddressService
  ) {
    this.vault = this.navParams.get('vault');
    this.vaultId = this.navParams.get('vaultId');
    this.wallets = this.navParams.get('wallets');
  }

  async ionViewWillEnter() {
    this.formatWhiteList();
    const transactions = await this.vaultsService.getTxHistory(this.vault);
    this.transactions = transactions.filter(t => !t.isInvite).map(t => {
      const wallet = this.wallets.find(w => w.client.getRootAddress().toString() == t.addressTo);

      const amount = t.outputs.reduce((sum, output) => {
        return sum = sum + output.amount;
      }, 0);

      return {
        name: wallet ? wallet.name : t.address,
        amount: amount,
        fee: t.fee
      }

    });
  }

  private async formatWhiteList() {
    const whitelist = [];
    for (let address of this.vault.whitelist) {
      const addressInfo = await this.addressService.getAddressInfo(address);
      const wallet = this.wallets.find(w => w.client.getRootAddress().toString() == addressInfo.address);
      const label = (wallet && wallet.name) ? wallet.name : (addressInfo.alias || addressInfo.address);
      console.log(wallet, label);
      whitelist.push({label, address: addressInfo.address, alias: addressInfo.alias});
    }
    this.whitelist = whitelist;
  }


  //todo  navigate to sendtoaddress
  //todo  navigate to resetVault






}

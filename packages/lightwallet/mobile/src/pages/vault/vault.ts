import { Component } from '@angular/core';
import { IonicPage,  NavParams } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { IDisplayWallet } from '@merit/common/models/display-wallet';
import { VaultsService }from '@merit/common/services/vaults.service';

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
    private vaultsService: VaultsService
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

  //todo do we need this? Or is alias+address enough?
  private formatWhiteList() {
    const whitelist = [];
    for (let entity of this.vault.whitelist) {
      const wallet = this.wallets.find(w => w.client.getRootAddress().toString() == entity.address);
      const label = (wallet && wallet.name) ? wallet.name : (entity.alias || entity.address);
      whitelist.push({label, address: entity.address, alias: entity.alias});
    }
    this.whitelist = whitelist;
  }


  //todo  navigate to sendtoaddress
  //todo  navigate to resetVault






}

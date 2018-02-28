import { Component } from '@angular/core';
import { IonicPage,  NavParams } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { IDisplayWallet } from '@merit/common/models/wallet';
import { VaultService }from '@merit/common/services/vaults.service';

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

  public whiteList: Array<{label: string, address: string, alias: string}>;

  constructor(
    private navParams: NavParams,
    private vaultService: VaultService
  ) {

  }

  ionViewDidLoad() {
    this.vault = this.navParams.get('vault');
    this.vaultId = this.navParams.get('vaultId');
    this.wallets = this.navParams.get('wallets');
  }

  async ionViewWillEnter() {
    this.formatWhiteList();
    this.transactions = this.vaultService.getTxHistory(this.vault);
  }

  //todo do we need this? Or is alias+address enough?
  private formatWhiteList() {
    const whiteList = [];
    for (let wallet of this.wallets) {
      let wallet = this.wallets.find(w => w.client.getRootAddress().toString() == address);

      let info = {address: addressInfo.address, alias: addressInfo.alias, label: ''};
      info.label = (wallet && wallet.name) ? wallet.name : (addressInfo.alias || addressInfo.address);
    }
  }


  //todo  navigate to sendtoaddress
  //todo  navigate to resetVault






}

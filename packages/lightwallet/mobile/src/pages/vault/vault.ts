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

  public whiteList: Array<{label: string, address: string, alias: string}>;

  constructor(
    private navParams: NavParams,
    private vaultsService: VaultsService
  ) {

  }

  ionViewDidLoad() {
    this.vault = this.navParams.get('vault');
    this.vaultId = this.navParams.get('vaultId');
    this.wallets = this.navParams.get('wallets');
  }

  async ionViewWillEnter() {
    this.formatWhiteList();
    this.transactions = await this.vaultsService.getTxHistory(this.vault); 
  }

  //todo do we need this? Or is alias+address enough?
  private formatWhiteList() {
    const whiteList = [];
    for (let entity of this.vault.whiteList) {
      const wallet = this.wallets.find(w => w.client.getRootAddress().toString() == entity.address);
      const label = (wallet && wallet.name) ? wallet.name : (entity.alias || entity.address);
      this.whiteList.push({label, address: entity.address, alias: entity.alias});
    }
    this.whiteList = whiteList;
  }


  //todo  navigate to sendtoaddress
  //todo  navigate to resetVault






}

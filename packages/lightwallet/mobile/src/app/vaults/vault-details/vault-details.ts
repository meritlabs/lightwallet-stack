import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IDisplayWallet } from "merit/../models/display-wallet";
import { SendService } from 'merit/transact/send/send.service';

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
  public vaultId: string;
  public wallets: Array<IDisplayWallet>;
  public transactions: Array<any>;

  public whiteList: Array<{label: string, address: string, alias: string}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sendService: SendService,
    public vaultService: VaultService
  ) {
    this.vault = this.navParams.get('vault');
    this.wallets = this.navParams.get('wallets');
    this.vaultId = this.navParams.get('vaultId');
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {

  }

  async updateWhiteListInfo() {
    let whiteList = [];
    for (let address of this.vault.whitelist) {
      let addressInfo = await this.sendService.getAddressInfo();
      let wallet = this.wallets.find(w => w.client.getRootAddress().toString() == address);

      let info = {address: addressInfo.address, alias: addressInfo.alias, label: ''};
      info.label = (wallet && wallet.name) ? wallet.name : (addressInfo.alias || addressInfo.address);
    }
    this.whiteList = whiteList;
  }

  async getTxHistory() {
    return await this.vaultsService.getVaultTxHistory(wallet, this.vault);
  }




}
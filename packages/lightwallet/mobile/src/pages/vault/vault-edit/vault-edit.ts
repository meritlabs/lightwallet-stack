import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { IDisplayWallet } from "@merit/common/models/display-wallet";
import { IWhitelistWallet } from "@merit/mobile/pages/vault/select-whitelist/select-whitelist";
import { RateService } from "@merit/common/services/rate.service";
import { VaultsService } from "@merit/common/services/vaults.service";


@IonicPage()
@Component({
  selector: 'view-vault-edit',
  templateUrl: 'vault-edit.html',
})
export class VaultEditView {

  public vault;

  public vaultName: string;
  public whitelist: any;
  public wallets: Array<IWhitelistWallet>;
  public wallet: IDisplayWallet;
  public amount: number;
  public masterKey: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private alertCtrl: AlertController,
    private vaultsService: VaultsService
  ) {
    this.vault = this.navParams.get('vault');
    console.log(this.vault, 'vault');
    this.vaultName = this.vault.name;
    this.amount = this.vault.amount;
  }

  edit() {

    this.alertCtrl.create({
      title: 'Renew Vault?',
      message: 'All pending transactions will be canceled and timeout will be reset. Do you want to reset the vault?',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'Yes', handler: () => {

          this.navCtrl.push('VaultEditConfirm', {
            vaultName: this.vaultName,
            whitelist: this.whitelist,
            wallet: this.wallet,
            amount: this.rateService.mrtToMicro(this.amount),
            masterKey: this.masterKey
          });

        }}
      ]
    }).present();
  }


  get isNextStepAvailable() {
    return (
      this.vaultName
      && this.amount
      && this.rateService.mrtToMicro(this.amount) <= this.vault.walletClient.status.spendableAmount
      && this.wallets.filter(w => w.selected).length
    )
  }

  regenerateMasterKey() {
    this.masterKey = this.vaultsService.createMasterKey(this.vault);
  }

}

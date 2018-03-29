import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IVault } from "@merit/common/models/vault";
import { RateService } from "@merit/common/services/rate.service";
import { VaultsService } from '@merit/common/services/vaults.service';

@IonicPage()
@Component({
  selector: 'view-vault-deposit',
  templateUrl: 'vault-deposit.html',
})
export class VaultDepositView {

  public vault: IVault;
  public amount;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private vaultsService: VaultsService
  ) {
    this.vault = this.navParams.get('vault');
  }

  get isSendingAvailable() {
      return (
        this.amount
        && this.amount > 0
        && this.rateService.mrtToMicro(this.amount) <= this.vault.walletClient.balance.totalConfirmedAmount
      )
  }

  async send() {
    await this.vaultsService.depositVault(this.vault, this.rateService.mrtToMicro(this.amount));
    this.navCtrl.popToRoot();
  }

}

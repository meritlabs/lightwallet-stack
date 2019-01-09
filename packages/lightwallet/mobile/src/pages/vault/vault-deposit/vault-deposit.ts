import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { RateService } from '@merit/common/services/rate.service';
import { VaultsService } from '@merit/common/services/vaults.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

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
    private vaultsService: VaultsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastControllerService,
  ) {
    this.vault = this.navParams.get('vault');
  }

  get isSendingAvailable() {
    return (
      this.amount &&
      this.amount > 0 &&
      this.rateService.mrtToMicro(this.amount) <= this.vault.walletClient.balance.totalConfirmedAmount
    );
  }

  async send() {
    const loader = this.loadingCtrl.create({ content: 'Sending transaction...' });
    loader.present();
    try {
      await this.vaultsService.depositVault(this.vault, this.rateService.mrtToMicro(this.amount));
      this.navCtrl.popToRoot();
    } catch (e) {
      this.toastCtrl.error(e);
    }
    loader.dismiss();
  }
}

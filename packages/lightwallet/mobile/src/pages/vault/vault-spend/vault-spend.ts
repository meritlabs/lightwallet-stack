import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { VaultsService } from '@merit/common/services/vaults.service';
import { ToastConfig, MeritToastController } from '@merit/common/services/toast.controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

@IonicPage()
@Component({
  selector: 'view-vault-spend',
  templateUrl: 'vault-spend.html',
})
export class VaultSpendView {

  public amount: number;
  public vault: IVault;
  public whitelist: Array<{name: string, unlocked: boolean, address: string, alias: string}>;
  public recipient: {name: string, unlocked: boolean, address: string, alias: string};
  public fee: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private vaultsService: VaultsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: MeritToastController,
    private modalCtrl: ModalController
  ) {
    const whitelist = this.navParams.get('whitelist');
    this.whitelist = whitelist.map(w => {
      return {
        name: w.label,
        unlock: true,
        address: w.address,
        alias: w.alias
      }
    });
    this.recipient = this.whitelist[0];
    this.vault = this.navParams.get('vault');
  }

  async send() {

    const loader = this.loadingCtrl.create({ content: 'Importing wallet' });
    loader.present();
    try {
      await this.vaultsService.sendFromVault(this.vault, this.amount, this.recipient.address);
      this.navCtrl.pop();
    } catch (e) {
      this.toastCtrl.create({
        message: e.message || 'Send failed ',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    } finally {
      loader.dismiss();
    }
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.recipient,
      availableWallets: this.whitelist
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.recipient = wallet
      }
    });
    return modal.present();
  }

  get isSendingAvailable() {
    return (
        this.amount
        && this.rateService.mrtToMicro(this.amount) < this.vault.amount
    )
  }

}

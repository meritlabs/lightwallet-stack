import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { IVault } from '@merit/common/models/vault';
import { VaultsService } from '@merit/common/services/vaults.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { RateService } from "@merit/common/services/rate.service";

interface IWhiteListRecord {name: string, confirmed: boolean, address: string, alias: string}

@IonicPage()
@Component({
  selector: 'view-vault-spend',
  templateUrl: 'vault-spend.html',
})
export class VaultSpendView {

  public amount: number;
  public vault: IVault;
  public whitelist: Array<IWhiteListRecord>;
  public recipient: IWhiteListRecord;
  public fee: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private vaultsService: VaultsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastControllerService,
    private modalCtrl: ModalController,
    private rateService: RateService
  ) {
    this.whitelist = this.navParams.get('whitelist').map(w => {
      return {
        name: w.label,
        confirmed: true,
        address: w.address,
        alias: w.alias
      }
    });
    this.recipient = this.whitelist[0];
    this.vault = this.navParams.get('vault');
  }

  async send() {

    const loader = this.loadingCtrl.create({ content: 'Creating transaction' });
    loader.present();
    try {
      const amount =  this.rateService.mrtToMicro(this.amount);
      const address = this.recipient.address;
      await this.vaultsService.sendFromVault(this.vault, amount, address);
      this.navCtrl.pop();
    } catch (e) {
      console.error(e);
      this.toastCtrl.error(e.message || 'Send failed');
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
        && this.rateService.mrtToMicro(this.amount) <= this.vault.amount
    )
  }

}

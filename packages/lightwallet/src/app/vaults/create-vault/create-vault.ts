import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ModalController } from 'ionic-angular';
import { IDisplayWallet } from "merit/../models/display-wallet";
import { RateService } from "merit/transact/rate.service";
import { MERIT_MODAL_OPTS } from 'merit/../utils/constants';


@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault',
  templateUrl: 'create-vault.html',
})
export class CreateVaultView {

  public formData: { vaultName: string, wallets: Array<any>, wallet:IDisplayWallet, amount:number };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private modalCtrl: ModalController
  ) {

    let wallets = this.navParams.get('wallets');

    this.formData = {
      vaultName: '',
      wallet: wallets[0],
      wallets: wallets.map(w => Object.assign({selected: false}, w)),
      amount: 0
    };
  }

  get isNextStepAvailable() {
    return (
      this.formData.vaultName
      && this.formData.amount
      && this.rateService.mrtToMicro(this.formData.amount) < this.formData.wallet.client.status.spendableAmount
      && this.formData.wallets.filter(w => w.selected).length
    )
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.formData.wallet,
      availableWallets: this.formData.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.formData.wallet = wallet;
      }
    });
    return modal.present();
  }

  toConfirm() {

    this.navCtrl.push('ConfirmView', {
      whitelist: this.formData.wallets.filter(w => w.selected),
      wallet: this.formData.wallet,
      amount: this.formData.amount
    });

  }


}
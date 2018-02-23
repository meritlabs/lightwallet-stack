import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ModalController } from 'ionic-angular';
import { IDisplayWallet } from "merit/../models/display-wallet";
import { RateService } from "merit/transact/rate.service";
import { MERIT_MODAL_OPTS } from 'merit/../utils/constants';
import { IWhitelistWallet } from "merit/vaults/select-whitelist/select-whitelist";

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault',
  templateUrl: 'create-vault.html',
})
export class CreateVaultView {

  public vaultName: string;
  public wallets: Array<IWhitelistWallet>;
  public wallet: IDisplayWallet;
  public whiteList: Array<IWhitelistWallet>;
  public amount: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private modalCtrl: ModalController
  ) {
    let wallets = this.navParams.get('wallets');
    this.wallets = wallets.map(w => Object.assign({selected: false}, w));
    this.wallet = this.wallets[0];
    this.whiteList = [];
    this.amount = 0;
  }

  get isNextStepAvailable() {
    return (
      this.vaultName
      && this.amount
      && this.rateService.mrtToMicro(this.amount) < this.wallet.client.status.spendableAmount
      && this.whiteList.length
    )
  }

  selectWhitelist() {
    let modal = this.modalCtrl.create('SelectWhitelistModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);

    modal.onDidDismiss(whitelist => this.whiteList = whitelist.filter(w => w.selected) );

    modal.present();
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets.map(w => w.client)
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = this.wallets.find(w => w.client.id == wallet.id);
      }
    });
    return modal.present();
  }

  toConfirm() {
    this.navCtrl.push('ConfirmView', {
      whiteList: this.whiteList,
      wallet: this.wallet,
      amount: this.amount
    });
  }


}
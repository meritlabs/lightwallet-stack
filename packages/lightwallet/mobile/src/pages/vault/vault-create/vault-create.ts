import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ModalController } from 'ionic-angular';
import { DisplayWallet } from "@merit/common/models/display-wallet";
import { RateService } from "@merit/common/services/rate.service";
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IWhitelistWallet } from "@merit/mobile/pages/vault/select-whitelist/select-whitelist";
import { ENV } from '@app/env';


@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-vault-create',
  templateUrl: 'vault-create.html',
})
export class VaultCreateView {

  public vaultName: string;
  public wallets: Array<IWhitelistWallet>;
  public wallet: DisplayWallet;
  public amount: number;
  public spendaleConfirmAmount: number;
  public insufficientConfirmedAmountError: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private modalCtrl: ModalController
  ) {
    this.wallets = this.navParams.get('wallets')
      .filter(w => w.confirmed)
      .map(w => Object.assign({ selected: false, name: w.name }, w));
    this.wallet = this.wallets[0];

  }

  get isNextStepAvailable() {
    return (
      this.vaultName
      && this.amount
      && this.rateService.mrtToMicro(this.amount) <= this.wallet.client.status.confirmedAmount
      && this.wallets.filter(w => w.selected).length
    )
  }

  get whiteList() {
    return this.wallets.filter(w => w.selected);
  }

  hasInsufficientConfirmedFunds() {
    if (!this.wallet) return false;
    const micros = this.rateService.mrtToMicro(this.amount);
    return (this.wallet.client.status.confirmedAmount <  micros) && (micros <= this.wallet.client.status.spendableAmount);
  }

  selectWhitelist() {

    let modal = this.modalCtrl.create('SelectWhitelistModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
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
    let network = this.wallet.client.credentials.network || ENV.network;

    let phrase = this.wallet.client.getNewMnemonic(null);
    let key = phrase.toHDPrivateKey('', network);

    this.navCtrl.push('VaultCreateConfirmView', {vaultData: {
      vaultName: this.vaultName,
      whiteList: this.whiteList,
      wallet: this.wallet,
      amount: this.rateService.mrtToMicro(this.amount),
      masterKey: {key, phrase}
    }});
  }

}

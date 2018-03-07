import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { DisplayWallet } from "@merit/common/models/display-wallet";
import { IWhitelistWallet } from "@merit/mobile/pages/vault/select-whitelist/select-whitelist";
import { RateService } from "@merit/common/services/rate.service";
import { VaultsService } from "@merit/common/services/vaults.service";
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';


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
  public wallet: DisplayWallet;
  public amount: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private alertCtrl: AlertController,
    private vaultsService: VaultsService,
    private modalCtrl: ModalController
  ) {
    this.vault = this.navParams.get('vault');
    this.vaultName = this.vault.name;
    this.amount = this.vault.amount;
    this.wallets = this.navParams.get('wallets');

    this.wallets.forEach(w => {
      if (this.vault.whitelist.some(addr => addr == w.client.getRootAddress())) {
        w.selected = true;
      }
    });
    this.whitelist = this.wallets.filter(w => w.selected);
  }

  edit() {
    this.toConfirm()
  }

  toConfirm() {
    this.navCtrl.push('VaultEditConfirmView', {vaultData: {
      vaultName: this.vaultName,
      whitelist: this.whitelist,
      vault: this.vault
    }});
  }

  selectWhitelist() {
    let modal = this.modalCtrl.create('SelectWhitelistModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss(() => {
      this.whitelist = this.wallets.filter(w => w.selected);
    });
    modal.present();
  }

  get isNextStepAvailable() {
    return (
      this.vaultName
      && this.whitelist.length
    )
  }


}

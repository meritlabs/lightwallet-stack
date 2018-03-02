import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { IDisplayWallet } from "@merit/common/models/display-wallet";
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
  public wallet: IDisplayWallet;
  public amount: number;
  public masterKey: string;

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
    this.masterKey = this.vault.masterKey;
    this.whitelist = this.navParams.get('whitelist');
    this.wallets = this.navParams.get('wallets');
  }

  get whiteList() {
    return this.wallets.filter(w => w.selected);
  }

  edit() {

    if (!this.masterKey) return this.toConfirm();

    this.alertCtrl.create({
      title: 'Did you write your recovery phrase down?',
      message: 'It is necessary to keep your money save ',
      buttons: [
        { text: 'Cancel', role: 'cancel', handler: () => {} },
        { text: 'Yes', handler: () => this.toConfirm() }
      ]
    }).present();
  }

  toConfirm() {
    this.navCtrl.push('VaultEditConfirmView', {vaultData: {
      vaultName: this.vaultName,
      whitelist: this.whitelist,
      wallet: this.wallet,
      amount: this.rateService.mrtToMicro(this.amount),
      masterKey: this.masterKey
    }});
  }

  selectWhitelist() {
    let modal = this.modalCtrl.create('SelectWhitelistModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.present();
  }

  get isNextStepAvailable() {
    return (
      this.vaultName
      && this.whitelist
    )
  }

  regenerateMasterKey() {
    this.masterKey = this.vaultsService.createMasterKey(this.vault);
  }

}

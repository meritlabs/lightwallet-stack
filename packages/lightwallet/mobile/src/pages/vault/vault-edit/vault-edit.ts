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
  public masterKey: {key: any, phrase: string};

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
    this.wallets = this.navParams.get('wallets');

    this.wallets.forEach(w => {
      if (this.vault.whitelist.some(addr => addr == w.client.getRootAddress())) {
        w.selected = true;
      }
    });
    this.whitelist = this.wallets.filter(w => w.selected);
  }

  edit() {

    if (!this.masterKey) return this.toConfirm();

    this.alertCtrl.create({
      title: 'Did you write your recovery phrase down?',
      message: 'It is necessary to keep your money save ',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes', handler: () => this.toConfirm() }
      ]
    }).present();
  }

  toConfirm() {
    this.navCtrl.push('VaultEditConfirmView', {vaultData: {
      vaultName: this.vaultName,
      whitelist: this.whitelist,
      masterKey: this.masterKey,
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

  regenerateMasterKey() {
    this.masterKey = this.vaultsService.createMasterKey(this.vault);
  }


}

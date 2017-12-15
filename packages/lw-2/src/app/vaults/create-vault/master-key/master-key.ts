import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { PopupService } from "merit/core/popup.service";
import { BwcService } from 'merit/core/bwc.service';
import { MeritWalletClient } from './../../../../lib/merit-wallet-client';
import { ConfigService } from 'merit/shared/config.service';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-master-key',
  templateUrl: 'master-key.html',
})
export class CreateVaultMasterKeyView {

  public formData = { masterKey: null, masterKeyMnemonic: null};

  constructor(
    private navCtrl:NavController,
    private navParams: NavParams,
    private configService: ConfigService,
    private createVaultService: CreateVaultService,
    private popupService: PopupService,
    private bwcService: BwcService,
  ){}

  ionViewDidLoad() {

    const bitcore = this.bwcService.getBitcore();

    let data = this.createVaultService.getData();

    if (!data.masterKey) {
      let masterKeyMnemonic = data.selectedWallet.getNewMnemonic(undefined);

      let network = data.selectedWallet.credentials.network || this.configService.getDefaults().network.name;
      let masterKey = masterKeyMnemonic.toHDPrivateKey('', network);

      data.masterKey = masterKey;
      data.masterKeyMnemonic = masterKeyMnemonic;

      this.createVaultService.updateData(data);
      data = this.createVaultService.getData();
    }

    this.formData.masterKey = data.masterKey;
    this.formData.masterKeyMnemonic = data.masterKeyMnemonic.toString();
  }

  confirm() {
    this.popupService.ionicConfirm(
      'Master key', 'Did you copy the master key?', 'Yes', 'No')
      .then((result: boolean) => {
        if (result) this.toVautlSummary();
        return;
      });
  }

  toVautlSummary() {
    this.navCtrl.push('CreateVaultSummaryView', { refreshVaultList: this.navParams.get('refreshVaultList') });
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopupService } from '@merit/mobile/app/core/popup.service';
import { CreateVaultService } from '@merit/mobile/app/vaults/create-vault/create-vault.service';
import { ENV } from '@app/env';
import { MWCService } from '@merit/common/providers/mwc';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-master-key',
  templateUrl: 'master-key.html',
})
export class CreateVaultMasterKeyView {

  public formData = { masterKey: null, masterKeyMnemonic: null };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private createVaultService: CreateVaultService,
              private popupService: PopupService,
              private bwcService: MWCService) {
  }

  ionViewDidLoad() {

    const bitcore = this.bwcService.getBitcore();

    let data = this.createVaultService.getData();

    if (!data.masterKey) {
      let masterKeyMnemonic = data.selectedWallet.getNewMnemonic(undefined);

      let network = data.selectedWallet.credentials.network || ENV.network;
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
    this.popupService.confirm(
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

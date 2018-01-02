import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, AlertController, Events } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';

// TODO use OnPush strategy with appropriate inputs/outputs
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {

  @Input() vaults = [];

  @Input() refreshVaultList = () => {};

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private navCtrl: NavController){}

  toAddVault() {
    this.navCtrl.push('CreateVaultGeneralInfoView', { refreshVaultList: this.refreshVaultList });
  }

  toVault(vault) {
    this.navCtrl.push('VaultDetailsView', { vaultId: vault._id, vault: vault });
  }
}

import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileService } from 'merit/core/profile.service';

// TODO use OnPush strategy with appropriate inputs/outputs
@Component({
  selector: 'view-vaults',
  templateUrl: 'vaults.html',
})
export class VaultsView {

  hasUnlockedWallets: boolean;

  @Input() wallets = [];
  @Input() vaults = [];

  @Input() refreshVaultList = () => {};

  constructor(private navCtrl: NavController) {
    this.hasUnlockedWallets = this.wallets.some(w => w.confirmed);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.wallets && changes.wallets.currentValue) {
      this.hasUnlockedWallets = changes.wallets.currentValue.some(w => w.confirmed);
    }
  }

  toAddVault() {
    this.navCtrl.push('CreateVaultGeneralInfoView', { refreshVaultList: this.refreshVaultList });
  }

  toVault(vault) {
    this.navCtrl.push('VaultDetailsView', { vaultId: vault._id, vault: vault });
  }
}

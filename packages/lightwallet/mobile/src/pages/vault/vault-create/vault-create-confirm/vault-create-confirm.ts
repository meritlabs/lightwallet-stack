import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RateService } from '@merit/common/services/rate.service';
import { IVaultCreateData, VaultsService } from '@merit/common/services/vaults.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

@IonicPage()
@Component({
  selector: 'view-vault-create-confirm',
  templateUrl: 'vault-create-confirm.html',
})
export class VaultCreateConfirmView {
  private vaultData: IVaultCreateData;

  public copied: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private toastCtrl: ToastControllerService,
    private vaultsService: VaultsService,
    private loadingCtrl: LoadingController,
  ) {
    this.vaultData = this.navParams.get('vaultData');
  }

  create() {
    if (!this.copied) {
      this.alertCtrl
        .create({
          title: 'Did you write your master key phrase down?',
          message: 'It is necessary to keep your money safe.',
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Yes',
              handler: () => {
                this.createVault();
              },
            },
          ],
        })
        .present();
    } else {
      this.createVault();
    }
  }

  private async createVault() {
    const loader = this.loadingCtrl.create({ content: 'Creating vault' });
    loader.present();
    try {
      await this.vaultsService.createVault(this.vaultData);
      this.navCtrl.popToRoot();
    } catch (e) {
      console.error(e);
      this.toastCtrl.error(e.message || 'Failed to create vault');
    } finally {
      loader.dismiss();
    }
  }

  public markCopied() {
    this.copied = true;
    this.toastCtrl.success('Copied to clipboard');
  }
}

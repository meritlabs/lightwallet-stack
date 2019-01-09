import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  LoadingController,
} from 'ionic-angular';
import { IWhitelistWallet } from '@merit/mobile/pages/vault/select-whitelist/select-whitelist';
import { VaultsService } from '@merit/common/services/vaults.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ENV } from '@app/env';
import { mnemonicToHDPrivateKey } from '@merit/common/utils/mnemonic';

@IonicPage()
@Component({
  selector: 'view-vault-edit',
  templateUrl: 'vault-edit.html',
})
export class VaultEditView {
  public vault;

  public vaultName: string;
  public whitelist: any;
  public wallets: Array<any>;
  public wallet: MeritWalletClient;
  public amount: number;

  private previous: any;
  private whitelistChanged: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private vaultsService: VaultsService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastControllerService,
  ) {
    this.vault = this.navParams.get('vault');
    this.vaultName = this.vault.name;
    this.amount = this.vault.amount;
    this.wallets = this.navParams.get('wallets');

    this.wallets.forEach(w => {
      if (this.vault.whitelist.some(addr => addr == w.rootAddress)) {
        w.selected = true;
      }
    });
    this.whitelist = this.wallets.filter(w => w.selected);

    this.previous = {
      name: this.vault.name,
      whitelist: this.vault.whitelist.reduce((str, addr) => {
        return str + addr.toString();
      }, ''),
    };
  }

  async edit(highlightInvalidInput = false, previousValue = '') {
    if (this.whitelistChanged) {
      this.alertCtrl
        .create({
          title: 'Renew Vault?',
          message:
            'Changing the whitelist will cancel all pending transactions and charge a fee. Enter master key (phrase) to continue',
          cssClass: highlightInvalidInput ? 'invalid-input-prompt' : '',
          inputs: [
            {
              value: previousValue,
              name: 'phrase',
              placeholder: 'Master Phrase',
            },
          ],
          buttons: [
            { text: 'Cancel', role: 'cancel', handler: () => {} },
            {
              text: 'Yes',
              handler: value => {
                this.renew(value.phrase);
              },
            },
          ],
        })
        .present();
    } else {
      if (this.vaultName != this.previous.name) await this.editName();
      this.navCtrl.pop();
    }
  }

  private async renew(phrase) {
    let xMasterKey;
    try {
      const words = phrase
        .replace(/\s\s+/g, ' ')
        .trim()
        .toLowerCase();
      xMasterKey = mnemonicToHDPrivateKey(words, '', ENV.network);
    } catch (ex) {
      console.warn(ex);
      return this.edit(true, phrase);
    }

    const loader = this.loadingCtrl.create({ content: 'Renewing vault...' });
    loader.present();
    try {
      await this.vaultsService.renewVaultWhitelist(this.vault, this.whitelist, xMasterKey);

      if (this.vaultName != this.previous.name) await this.editName();
      this.navCtrl.pop();
    } catch (e) {
      console.warn(e);
      this.toastCtrl.error(e.message || 'Failed to renew vault');
    } finally {
      loader.dismiss();
    }
  }

  private async editName() {
    await this.vaultsService.editVaultName(this.vault, this.vaultName);
    this.vault.name = this.vaultName;
  }

  selectWhitelist() {
    let modal = this.modalCtrl.create(
      'SelectWhitelistModal',
      {
        selectedWallet: this.wallet,
        availableWallets: this.wallets,
      },
      MERIT_MODAL_OPTS,
    );
    modal.onDidDismiss(() => {
      this.whitelist = this.wallets.filter(w => w.selected);
      this.checkWhitelistChange();
    });
    modal.present();
  }

  private checkWhitelistChange() {
    const newWl = this.whitelist.reduce((str, w) => {
      return str + w.rootAddress.toString();
    }, '');
    this.whitelistChanged = this.previous.whitelist != newWl;
  }

  get isEditAvailable() {
    return this.vaultName && this.whitelist.length && (this.vaultName != this.previous.name || this.whitelistChanged);
  }
}

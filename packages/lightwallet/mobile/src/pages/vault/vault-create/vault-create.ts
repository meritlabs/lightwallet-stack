import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ModalController } from 'ionic-angular';
import { RateService } from '@merit/common/services/rate.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { mnemonicToHDPrivateKey } from '@merit/common/utils/mnemonic';
import { ENV } from '@app/env';

@IonicPage({
  defaultHistory: ['WalletsView'],
})
@Component({
  selector: 'view-vault-create',
  templateUrl: 'vault-create.html',
})
export class VaultCreateView {
  public vaultName: string;
  public wallets: Array<any>;
  public wallet: MeritWalletClient;
  public amount: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rateService: RateService,
    private modalCtrl: ModalController,
  ) {
    this.wallets = this.navParams.get('wallets').filter(w => w.confirmed);
    this.wallet = this.wallets[0];
  }

  get isNextStepAvailable() {
    return (
      this.vaultName &&
      this.amount &&
      this.amount > 0 &&
      this.rateService.mrtToMicro(this.amount) <= this.wallet.balance.totalConfirmedAmount &&
      this.wallets.filter(w => w.selected).length
    );
  }

  get whiteList() {
    return this.wallets.filter(w => w.selected);
  }

  hasInsufficientConfirmedFunds() {
    if (!this.wallet) return false;
    const micros = this.rateService.mrtToMicro(this.amount);
    return this.wallet.balance.totalConfirmedAmount < micros && micros <= this.wallet.balance.spendableAmount;
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
    modal.present();
  }

  selectWallet() {
    const modal = this.modalCtrl.create(
      'SelectWalletModal',
      {
        selectedWallet: this.wallet,
        availableWallets: this.wallets,
      },
      MERIT_MODAL_OPTS,
    );
    modal.onDidDismiss(wallet => {
      if (wallet) {
        this.wallet = wallet;
      }
    });
    return modal.present();
  }

  toConfirm() {
    let network = this.wallet.credentials.network || ENV.network;

    let phrase = this.wallet.getNewMnemonic(null);
    let key = mnemonicToHDPrivateKey(phrase, '', network);

    this.navCtrl.push('VaultCreateConfirmView', {
      vaultData: {
        vaultName: this.vaultName,
        whiteList: this.whiteList,
        wallet: this.wallet,
        amount: this.rateService.mrtToMicro(this.amount),
        masterKey: { key, phrase },
      },
    });
  }
}

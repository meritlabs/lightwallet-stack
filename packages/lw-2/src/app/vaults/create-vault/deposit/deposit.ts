import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { Wallet } from "merit/wallets/wallet.model";

@IonicPage({
  defaultHistory: ['ProfileView']
})
@Component({
  selector: 'view-create-vault-deposit',
  templateUrl: 'deposit.html',
})
export class CreateVaultDepositView {

  public formData = { amountToDeposit: 0.0, amountAvailable: 0.0 };
  public isNextAvailable = false;

  constructor(
    private navCtl: NavController,
    private createVaultService: CreateVaultService,
    private profileService: ProfileService,
    private walletService: WalletService,
  ) {}

  checkNextAvailable() {
    this.isNextAvailable = this.formData.amountToDeposit > 0 && this.formData.amountAvailable >= this.formData.amountToDeposit;
  }

  ionViewDidLoad() {
    let data = this.createVaultService.getData();
    this.formData.amountToDeposit = data.amountToDeposit;
    this.formData.amountAvailable = data.amountAvailable;
    this.checkNextAvailable();

    this.updateAllWallets().then((wallets: Array<Wallet>) => {
      _.each(wallets, (w) => console.log(w));
      const summ = this.computeBalances(wallets);
      console.log(summ);
    });
  }

  toMasterKey() {
    this.createVaultService.updateData(this.formData);
    this.navCtl.push('CreateVaultMasterKeyView');
  }

  private updateAllWallets(): Promise<Array<Wallet>> {
    const wallets = this.profileService.getWallets().then((ws) => {
      return Promise.all(_.map(ws, async (wallet: any) => { //ToDo: type it correctly Wallet and IMeritWalletClient are not interchangable
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet; 
      }));
    });
    return wallets;
  }

  private computeBalances(wallets: Array<Wallet>) {
    return _.reduce(wallets, (acc: number, w: Wallet) => {
      console.log(acc, w.status.balance.availableConfirmedAmount);
      return acc + w.status.balance.availableConfirmedAmount;
    }, 0);
  }
}
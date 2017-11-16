import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { Wallet } from "merit/wallets/wallet.model";
import { BwcService } from "merit/core/bwc.service";

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
  private bitcore = null;

  constructor(
    private navCtl: NavController,
    private createVaultService: CreateVaultService,
    private profileService: ProfileService,
    private walletService: WalletService,
    private bwcService: BwcService,
  ) {}

  checkNextAvailable() {
    this.isNextAvailable = this.formData.amountToDeposit > 0 && this.formData.amountAvailable >= this.formData.amountToDeposit;
  }

  ionViewDidLoad() {
    this.bitcore = this.bwcService.getBitcore();
    
    let data = this.createVaultService.getData();
    this.formData.amountToDeposit = data.amountToDeposit;
    this.formData.amountAvailable = data.amountAvailable;
    this.checkNextAvailable();

    this.getAllWallets().then((wallets: Array<Wallet>) => {
      _.each(wallets, (w) => console.log(w));
      const computed = this.computeBalances(wallets);
      const mrt = this.bitcore.Unit.fromMicros(computed).toMRT();
      this.formData.amountAvailable = mrt;
    });
  }

  toMasterKey() {
    this.createVaultService.updateData(this.formData);
    this.navCtl.push('CreateVaultMasterKeyView');
  }

  private getAllWallets(): Promise<Array<Wallet>> {
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
      return acc + w.status.balance.availableConfirmedAmount;
    }, 0);
  }
}

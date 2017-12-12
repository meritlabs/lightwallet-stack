import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CreateVaultService } from "merit/vaults/create-vault/create-vault.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ProfileService } from "merit/core/profile.service";
import { BwcService } from "merit/core/bwc.service";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { Logger } from 'merit/core/logger';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'view-create-vault-deposit',
  templateUrl: 'deposit.html',
})
export class CreateVaultDepositView {

  public formData = { totalAvailable: 0, amountToDeposit: null, amountAvailable: 0, selectedWallet: null, walletName: '' };
  public isNextAvailable = false;
  private bitcore = null;

  constructor(
    private navCtl: NavController,
    private createVaultService: CreateVaultService,
    private profileService: ProfileService,
    private walletService: WalletService,
    private bwcService: BwcService,
    private logger: Logger
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

    this.getAllWallets().then((wallets: Array<MeritWalletClient>) => {
      _.each(wallets, (w) => this.logger.info(w));
      const wallet = wallets[0];
      const computed = wallet.status.balance.availableConfirmedAmount;
      const total = wallet.status.balance.availableAmount;
      const mrt = this.bitcore.Unit.fromMicros(computed).toMRT();
      const totalMrt = this.bitcore.Unit.fromMicros(total).toMRT();
      this.formData.selectedWallet = wallet;
      this.formData.amountAvailable = mrt;
      this.formData.totalAvailable = totalMrt;
      this.formData.walletName = wallet.name || wallet.id;
    });

    this.checkNextAvailable();
  }

  toMasterKey() {
    this.createVaultService.updateData(this.formData);
    this.navCtl.push('CreateVaultMasterKeyView');
  }

  private getAllWallets(): Promise<Array<MeritWalletClient>> {
    return this.profileService.getWallets().then((ws) => {
      return Promise.all(_.map(ws, async (wallet: MeritWalletClient) => { 
        wallet.status = await this.walletService.getStatus(wallet);
        return wallet; 
      }));
    });
  }
}

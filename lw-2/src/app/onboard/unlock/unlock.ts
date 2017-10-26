import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletService } from '@app/wallets/wallet.service';


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'page-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockView {

  public unlockState:'success'|'fail';
  public formData = {unlockCode: ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    private walletService: WalletService
  ) {
  }

  ionViewDidLoad() {
    //do something here
  }

  unlock() {
    //unlock actions
    this.createAndUnlockWallet().then(() => {
      this.unlockState = 'success';
      this.navCtrl.push('TransactView');
    });
  }

  createAndUnlockWallet(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.walletService.createDefaultWallet().then((wallet: any) => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

}

import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';
import { WalletService } from '../../home/wallet.service';


@IonicComponent({
  defaultHistory: ['OnboardingComponent']
})
@Component({
  selector: 'component-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockComponent {

  public unlockState:'success'|'fail';
  public formData = {unockCode: ''};

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
      this.navCtrl.push('TransactComponent');
    });
  }

  createAndUnlockWallet(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.walletService.createDefaultWallet().then((wallet: any) => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

}

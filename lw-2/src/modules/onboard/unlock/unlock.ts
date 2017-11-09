import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController, ToastController} from 'ionic-angular';
import {ToastConfig} from "../../../shared/toast/toast.config";
import {WalletService} from "../../../shared/wallet.service";


@IonicPage({
  defaultHistory: ['OnboardingPage']
})
@Component({
  selector: 'page-unlock',
  templateUrl: 'unlock.html',
})
export class UnlockPage {

  public unlockState:'success'|'fail';
  public formData = {unlockCode: ''};

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private walletService:WalletService,
    private toastCtrl: ToastController,
    private loaderCtrl:LoadingController
  ) {
  }

  ionViewDidLoad() {
    //do something here
  }

  unlock() {

    let loader = this.loaderCtrl.create({content: 'Creating wallet...'});
    loader.present();

    this.walletService.createDefaultWallet(this.formData.unlockCode).then((walletParams) => {
      console.debug('created wallet', walletParams);
      loader.dismiss();
      this.navCtrl.push('ProfilePage');
    }).catch((err) => {
      loader.dismiss();
      this.unlockState = 'fail';
      this.toastCtrl.create({ message: err, cssClass: ToastConfig.CLASS_ERROR }).present();
    });

  }

}

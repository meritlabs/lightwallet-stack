import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";
import {ProfileService} from "merit/core/profile.service";


@IonicPage({
  segment: 'easy'
})
@Component({
  selector: 'view-easy-receive',
  templateUrl: 'easy-receive.html',
})
export class EasyReceiveView {


  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private easyReceiveService:EasyReceiveService,
    private app:App,
    private profileService:ProfileService
  ) {

    this.easyReceiveService.extractReceiptFromParams(this.navParams.get('receipt')).then((receipt) => {
      this.easyReceiveService.storePendingReceipt(receipt).then(() => {
        this.profileService.getWallets().then((wallets) => {
          //todo do proper check if user is logged in
          if (true) { //temp
            this.app.getRootNav().setRoot('TransactView');
          } else {
            this.app.getRootNav().setRoot('OnboardingView');
          }
        })
      });
    });

  }

  ionViewDidLoad() {
    //do something here
  }

}

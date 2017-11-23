import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'view-export-wallet',
  templateUrl: 'export-wallet.html',
})
export class ExportWalletView {


  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

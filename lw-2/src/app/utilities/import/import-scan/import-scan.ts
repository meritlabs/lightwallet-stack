import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['ImportView']
})
@Component({
  selector: 'view-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanView {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

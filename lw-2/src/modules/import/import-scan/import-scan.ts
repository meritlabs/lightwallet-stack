import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['ImportPage']
})
@Component({
  selector: 'page-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanPage {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

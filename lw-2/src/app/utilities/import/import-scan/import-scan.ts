import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['ImportComponent']
})
@Component({
  selector: 'component-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanComponent {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

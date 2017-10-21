import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent({
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

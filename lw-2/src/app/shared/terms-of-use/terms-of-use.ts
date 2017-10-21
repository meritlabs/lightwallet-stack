import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent()
@Component({
  selector: 'component-terms-of-use',
  templateUrl: 'terms-of-use.html',
})
export class TermsOfUseComponent {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

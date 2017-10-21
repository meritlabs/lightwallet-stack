import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent()
@Component({
  selector: 'component-send',
  templateUrl: 'send.html',
})
export class SendComponent {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

}

import { Component } from '@angular/core';
import { IonicComponent, NavController, NavParams } from 'ionic-angular';


@IonicComponent()
@Component({
  selector: 'component-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackComponent {

  public text:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
  }

  send() {
    //todo implement
    this.navCtrl.pop();
  }

}

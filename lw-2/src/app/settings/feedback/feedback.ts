import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
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

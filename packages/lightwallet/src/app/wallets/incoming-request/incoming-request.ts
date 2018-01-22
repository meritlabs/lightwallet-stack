import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  public unlockRequest:any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.unlockRequest = this.navParams.get('unlockRequest');
  }

  ionViewDidLoad() {
    //do something here
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  accept() {
    //todo do accepting
  }

  decline() {
    //todo do declining
  }

  toCreateContact() {

  }

  toBindContact() {

  }

}

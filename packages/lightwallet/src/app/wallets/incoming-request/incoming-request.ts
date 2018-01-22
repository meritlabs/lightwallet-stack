import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'view-incoming-request',
  templateUrl: 'incoming-request.html',
})
export class IncomingRequestModal {

  public unlockRequest:any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.unlockRequest = this.navParams.get('unlockRequest');
  }

  ionViewDidLoad() {
    //do something here
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-select-sending-option',
  templateUrl: 'select-sending-option.html',
})
export class SelectSendingOptionModal {

  public sendingOptions;
  public selectedSendingOption;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
  }

  async ionViewDidLoad() {
    this.sendingOptions = this.navParams.get('sendingOptions')
    this.selectedSendingOption = this.navParams.get('selectedSendingOption');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(sendingOption) {
    this.viewCtrl.dismiss(sendingOption);
  }

}

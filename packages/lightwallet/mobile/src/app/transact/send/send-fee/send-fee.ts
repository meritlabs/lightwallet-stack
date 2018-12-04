import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-send-fee',
  templateUrl: 'send-fee.html',
})
export class SendFeeView {
  feeLevels: Array<{ name: string; amount: number; nbBlocks: number }>;
  selectedLevelName: string;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.feeLevels = this.navParams.get('feeLevels');
    this.selectedLevelName = this.navParams.get('selectedLevelName');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(level) {
    this.viewCtrl.dismiss(level);
  }
}

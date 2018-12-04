import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

// TODO rename to ScannerNotAvailableView

@IonicPage()
@Component({
  selector: 'view-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanView {
  err;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.err = navParams.get('error');
    if (!this.err) {
      this.close();
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

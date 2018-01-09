import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Logger } from "merit/core/logger";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// TODO only show "Barcode scanner unavailable" message when we are certain that its not available

@IonicPage({
  defaultHistory: ['ImportView']
})
@Component({
  selector: 'view-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanView {

  err;

  constructor(
    private viewCtrl:ViewController,
    private barcodeScanner: BarcodeScanner,
    private logger:Logger
  ) {}

  close() {
    this.viewCtrl.dismiss();
  }

  async ionViewDidLoad() {
    if (BarcodeScanner.installed()) {
      try {
        const { text } =  await this.barcodeScanner.scan({formats: 'QR_CODE'});
        this.viewCtrl.dismiss(text);
      } catch (err) {
        this.err = err;
      }
    } else {
      this.err = 'This feature is available on mobile devices only.';
    }
  }

}

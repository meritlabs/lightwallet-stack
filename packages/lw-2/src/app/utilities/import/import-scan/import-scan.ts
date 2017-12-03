import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { Logger } from "merit/core/logger";
import { BarcodeScanner } from '@ionic-native/barcode-scanner'; 


declare var cordova:any;

@IonicPage({
  defaultHistory: ['ImportView']
})
@Component({
  selector: 'view-import-scan',
  templateUrl: 'import-scan.html',
})
export class ImportScanView {

  public scannerAvailable:boolean;

  public scannerPermitted:boolean;

  public err; 

  constructor(
    private viewCtrl:ViewController,
    private barcodeScanner: BarcodeScanner,
    private logger:Logger
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

    this.barcodeScanner.scan({formats: 'QR_CODE'}).then((barcodeData) => {
      this.viewCtrl.dismiss(barcodeData.text);
    }).catch((err) => { 
        this.err = err;  
    });
  }

}

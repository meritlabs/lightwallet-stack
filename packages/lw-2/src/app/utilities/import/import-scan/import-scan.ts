import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import {Logger} from "merit/core/logger";

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

  constructor(
    private viewCtrl:ViewController,
    private qrScanner: QRScanner,
    private logger:Logger
  ) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

    console.log('import scan onload');

    this.qrScanner.prepare().then((status:QRScannerStatus) => {
      this.scannerAvailable = true;

      if (status.authorized) {

        this.scannerPermitted = true;

        // start scanning
        this.qrScanner.scan().subscribe(
          (data:string) => {
            return this.viewCtrl.dismiss(data);
          },
          (error: string) => {
            this.logger.warn(error);
            return this.viewCtrl.dismiss();
          }
        );

        this.qrScanner.show();

      } else if (status.denied) {
        this.scannerPermitted = false;
        this.qrScanner.openSettings();
      } else {
        this.scannerPermitted = false;
      }

    }).catch((err) => {
      this.scannerAvailable = false;
    });
  }

}

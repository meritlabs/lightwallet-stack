import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

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
    private navCtrl: NavController,
    private Params: NavParams,
    private qrScanner: QRScanner
  ) {
  }

  ionViewDidLoad() {

    this.qrScanner.prepare().then((status:QRScannerStatus) => {
      this.scannerAvailable = true;

      if (status.authorized) {

        this.scannerPermitted = true;

        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((data:string) => {

          this.processScanned(data);

          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
        });

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

  processScanned(data) {

  }

}

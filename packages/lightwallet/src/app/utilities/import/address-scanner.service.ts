import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalController } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '../../../utils/constants';

@Injectable()
export class AddressScannerService {
  constructor(private modalCtrl: ModalController,
              private barcodeScanner: BarcodeScanner) {
  }

  async scanAddress() {
    let error;

    if (BarcodeScanner.installed()) {
      try {
        const { text: code } = await this.barcodeScanner.scan({ formats: 'QR_CODE' });
        if (code) {
          return code;
        }
      } catch (e) {
        error = e;
      }
    } else {
      error = 'This feature is available on mobile devices only.';
    }

    if (error) {
      await this.modalCtrl.create('ImportScanView', { error }, MERIT_MODAL_OPTS).present();
    }
  }
}

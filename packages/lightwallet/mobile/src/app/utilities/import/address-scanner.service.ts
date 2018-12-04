import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ModalController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

@Injectable()
export class AddressScannerService {
  _hasCameraPermissions: boolean;
  _deviceHasCamera: boolean;

  constructor(
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private diagnostic: Diagnostic,
  ) {}

  async scanAddress() {
    let error;

    if (this.hasPermission()) {
      try {
        const { text: code } = await this.barcodeScanner.scan({ formats: 'QR_CODE' });
        if (code) {
          return code;
        }
      } catch (e) {
        error = e == 'cordova_not_available' ? 'This feature is available in native applications only.' : e;
      }
    } else {
      error = 'This feature is available in native applications only.';
    }

    if (error) {
      await this.modalCtrl.create('ImportScanView', { error }, MERIT_MODAL_OPTS).present();
    }
  }

  async hasPermission() {
    if (!BarcodeScanner.installed() || !Diagnostic.installed()) return false;

    if (typeof this._deviceHasCamera !== 'boolean') {
      // check if we have a camera available
      this._deviceHasCamera = await this.diagnostic.isCameraPresent();
    }

    // no camera, can't scan barcodes
    if (!this._deviceHasCamera) return false;

    if (typeof this._hasCameraPermissions !== 'boolean') {
      // we didn't check/request permissions yet.. lets do that

      this._hasCameraPermissions =
        (await this.diagnostic.getCameraAuthorizationStatus(false)) === this.diagnostic.permissionStatus.GRANTED;
    }

    if (this._hasCameraPermissions === true) return true;

    this._hasCameraPermissions =
      (await this.diagnostic.requestCameraAuthorization(false)) === this.diagnostic.permissionStatus.GRANTED;

    return this._hasCameraPermissions;
  }
}

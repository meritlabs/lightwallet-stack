import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportScanView } from 'merit/utilities/import/import-scan/import-scan';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@NgModule({
  declarations: [
    ImportScanView,
  ],
  providers: [
    QRScanner
  ],
  imports: [
    IonicPageModule.forChild(ImportScanView),
  ],
})
export class ImportScanComponentModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportScanView } from 'merit/utilities/import/import-scan/import-scan';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@NgModule({
  declarations: [
    ImportScanView,
  ],
  providers: [
    BarcodeScanner
  ],
  imports: [
    IonicPageModule.forChild(ImportScanView),
  ],
})
export class ImportScanComponentModule {}

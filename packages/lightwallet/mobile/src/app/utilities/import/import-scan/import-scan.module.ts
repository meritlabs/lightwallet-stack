import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportScanView } from '@merit/mobile/app/utilities/import/import-scan/import-scan';

@NgModule({
  declarations: [ImportScanView],
  imports: [IonicPageModule.forChild(ImportScanView)],
})
export class ImportScanComponentModule {}

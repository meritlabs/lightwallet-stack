import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportScanPage } from './import-scan';

@NgModule({
  declarations: [
    ImportScanPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportScanPage),
  ],
})
export class ImportScanPageModule {}

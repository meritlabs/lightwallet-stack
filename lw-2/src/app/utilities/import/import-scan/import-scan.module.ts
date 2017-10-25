import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportScanComponent } from './import-scan';

@NgModule({
  declarations: [
    ImportScanComponent,
  ],
  imports: [
    IonicPageModule.forChild(ImportScanComponent),
  ],
})
export class ImportScanComponentModule {}

import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { ImportScanComponent } from './import-scan';

@NgModule({
  declarations: [
    ImportScanComponent,
  ],
  imports: [
    IonicComponentModule.forChild(ImportScanComponent),
  ],
})
export class ImportScanComponentModule {}

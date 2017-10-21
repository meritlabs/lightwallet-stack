import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { ImportComponent } from './import';
import {ConfigService} from "../../providers/config";

@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    IonicComponentModule.forChild(ImportComponent),
  ],
  providers: [
    ConfigService
  ]
})
export class ImportComponentModule {}

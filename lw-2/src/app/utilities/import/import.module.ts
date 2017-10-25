import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportComponent } from './import';
import {ConfigService} from "../../providers/config";

@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    IonicPageModule.forChild(ImportComponent),
  ],
  providers: [
    ConfigService
  ]
})
export class ImportComponentModule {}

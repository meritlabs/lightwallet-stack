import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { ImportComponent } from './import';
import {ConfigProvider} from "../../providers/config";

@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    IonicComponentModule.forChild(ImportComponent),
  ],
  providers: [
    ConfigProvider
  ]
})
export class ImportComponentModule {}

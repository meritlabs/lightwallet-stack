import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportPage } from './import';
import {ConfigProvider} from "../../providers/config";

@NgModule({
  declarations: [
    ImportPage
  ],
  imports: [
    IonicPageModule.forChild(ImportPage),
  ],
  providers: [
    ConfigProvider
  ]
})
export class ImportPageModule {}

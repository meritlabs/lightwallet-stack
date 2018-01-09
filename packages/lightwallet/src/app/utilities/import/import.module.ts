import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportView } from 'merit/utilities/import/import';

@NgModule({
  declarations: [
    ImportView
  ],
  imports: [
    IonicPageModule.forChild(ImportView),
  ]
})
export class ImportViewModule {
}

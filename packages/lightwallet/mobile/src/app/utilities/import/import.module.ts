import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportView } from '@merit/mobile/app/utilities/import/import';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';

@NgModule({
  declarations: [ImportView],
  imports: [IonicPageModule.forChild(ImportView), DirectivesModule],
})
export class ImportViewModule {}

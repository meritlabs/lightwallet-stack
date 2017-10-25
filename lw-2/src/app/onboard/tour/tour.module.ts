import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourView } from './tour';

@NgModule({
  declarations: [
    TourView,
  ],
  imports: [
    IonicPageModule.forChild(TourView),
  ],
})
export class TourComponentModule {}

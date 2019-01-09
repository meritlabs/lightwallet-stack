import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourView } from '@merit/mobile/app/onboard/tour/tour';

@NgModule({
  declarations: [TourView],
  imports: [IonicPageModule.forChild(TourView)],
})
export class TourModule {}
